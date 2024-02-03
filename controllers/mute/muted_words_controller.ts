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
import {} from "../../services/models/interests_model";
import {
  UserMutedWordParams,
  UserMutedWordsResult,
} from "../../services/models/muted_words_model";
import MutedWordsService from "../../services/mute/muted_words_service";

@Route("/api/v1/mutedWords")
@Tags("Mute")
export class MutedWordsController extends Controller {
  //!
  //!
  @Post("/mutedWords")
  @OperationId("mutedWords")
  @Security("jwt")
  @Response(StatusCodes.OK)
  @Response(StatusCodes.UNAUTHORIZED, "Unauthorized")
  @Response(
    StatusCodes.BAD_REQUEST,
    "Bad request. Kindly check your header and body params"
  )
  public async setMutedWord(
    @Body() body: UserMutedWordParams
  ): Promise<UserMutedWordsResult> {
    return await new MutedWordsService().muteAWord(body);
  }
}
