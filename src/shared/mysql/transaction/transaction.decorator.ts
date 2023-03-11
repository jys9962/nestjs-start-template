import { applyDecorators, SetMetadata } from "@nestjs/common";
import { MainDbRepository } from "@/shared/mysql/repository/implements/main-db.repository";

export const TRANSACTION_METADATA = "TRANSACTION_METADATA";
export const TRANSACTION_EXCEPT_METADATA = "TRANSACTION_EXCEPT_METADATA";

export function Transaction(
  repositoryToken: symbol = MainDbRepository.token
) {
  return applyDecorators(
    SetMetadata(TRANSACTION_METADATA, { token: repositoryToken })
  );
}

export function TransactionExcept() {
  return applyDecorators(
    SetMetadata(TRANSACTION_EXCEPT_METADATA, {})
  );
}