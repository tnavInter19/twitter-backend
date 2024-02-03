import { StatusCodes } from "http-status-codes";
import {
  Body,
  Controller,
  OperationId,
  Post,
  Response,
  Route,
  Security,
  Tags,
} from "tsoa";
import BlockAccountService from "../../services/block_account/block_account_service";
import {
  BlockAccountParams,
  BlockAccountResult,
} from "../../services/models/blocked_account_model";
import {} from "../../services/models/interests_model";

@Route("/api/v1/blockAccount")
@Tags("Block account")
export class BlockAccountController extends Controller {
  //!
  //!
  @Post("/blockAccount")
  @OperationId("blockAccount")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async setMutedWord(
    @Body() body: BlockAccountParams
  ): Promise<BlockAccountResult> {
    return await new BlockAccountService().blockAccount(body);
  }
}
