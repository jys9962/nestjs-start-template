import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { DiscoveryService, MetadataScanner, ModuleRef, Reflector } from '@nestjs/core'
import { TRANSACTION_EXCEPT_METADATA, TRANSACTION_METADATA } from '@/shared/mysql/transaction/transaction.decorator'
import { Pool, PoolConnection } from 'mysql2/promise'
import { CodeUtil } from '@/common/utils/code.util'
import { AbstractRepository, QUERY_FUNCTION } from '@/shared/mysql/repository/abstract.repository'

@Injectable()
export class TransactionService implements OnModuleInit {
  private providerSet: Set<any> = new Set()
  private proxyInstancesMap: Map<string, { revoke: () => void }[]> = new Map()

  constructor(
    private readonly logger: Logger,
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): any {
    this.discovery
      .getProviders()
      .filter(
        (wrapper) => wrapper.isDependencyTreeStatic(),
      )
      .filter(
        ({ instance }) => {
          return instance && Object.getPrototypeOf(instance)
        },
      )
      .forEach(
        ({ instance }) => {
          this.providerSet.add(instance)

          this.scanner.scanFromPrototype(
            instance,
            Object.getPrototypeOf(instance),
            (methodName: string) => {
              const metadata = this.reflector.get(TRANSACTION_METADATA, instance[methodName]) as { token: symbol }
              if (!metadata) {
                return
              }

              const { token } = metadata
              instance[methodName] = this.wrapTransactionMethod(instance[methodName], token)
            },
          )
        },
      )
  }

  private wrapTransactionMethod(
    originalMethod: Function,
    repositoryToken: symbol,
  ) {
    const $this = this
    const connectionPool: Pool = this.moduleRef.get<Pool>(repositoryToken, { strict: false })

    return async function (...args) {
      // @ts-ignore
      const currentInstance = this

      const inProgressTransaction = currentInstance[repositoryToken]
      if (inProgressTransaction) {
        return originalMethod.apply(currentInstance, args)
      }

      const transactionKey = CodeUtil.uuidV1(false)
      const connection = await connectionPool.getConnection()
      const proxyInstance = await $this.createProxyInstance(currentInstance, connection, repositoryToken, transactionKey)

      $this.logger.debug(`[TRANSACTION] start ${transactionKey}`)
      await connection.beginTransaction()
      try {

        const result = await originalMethod.apply(proxyInstance, args)

        await connection.commit()
        $this.logger.debug(`[TRANSACTION] commit ${transactionKey}`)

        return result

      } catch (e) {

        await connection.rollback()
        $this.logger.debug(`[TRANSACTION] rollback ${transactionKey}`)

        throw e

      } finally {

        await connection.release()
        $this.logger.debug(`[TRANSACTION] release ${transactionKey}`)

        $this.revokeProxyInstances(transactionKey)

      }
    }
  }

  private createProxyInstance(
    instance: any,
    connection: PoolConnection,
    repositoryToken: symbol,
    transactionKey: string,
  ): any {
    const proxyInstanceObject = Proxy.revocable(
      instance,
      {
        get: (
          target,
          name,
        ) => {
          if (name === repositoryToken) {
            return true
          }

          if (
            instance instanceof AbstractRepository &&
            instance.getToken() === repositoryToken &&
            name === QUERY_FUNCTION
          ) {
            return async (query) => {
              const [result] = await connection.query(query)
              query.transactionKey = transactionKey
              return result
            }
          }

          if (
            typeof target[name] === 'function' &&
            this.reflector.get(TRANSACTION_EXCEPT_METADATA, target[name])
          ) {
            return target[name].bind(instance)
          }

          return this.providerSet.has(target[name])
            ? this.createProxyInstance(target[name], connection, repositoryToken, transactionKey)
            : target[name]
        },
      },
    )

    this.registerProxyObject(transactionKey, proxyInstanceObject)
    return proxyInstanceObject.proxy
  }

  private registerProxyObject(
    transactionKey: string,
    proxyInstanceObject: { revoke: () => void },
  ) {
    const proxyObjectList = this.proxyInstancesMap.get(transactionKey) || []
    proxyObjectList.push(proxyInstanceObject)
    this.proxyInstancesMap.set(transactionKey, proxyObjectList)
  }

  private revokeProxyInstances(
    transactionKey: string,
  ) {
    const proxyObjectList = this.proxyInstancesMap.get(transactionKey) || []
    proxyObjectList.forEach(proxyObj => proxyObj.revoke())
    this.proxyInstancesMap.delete(transactionKey)
  }
}