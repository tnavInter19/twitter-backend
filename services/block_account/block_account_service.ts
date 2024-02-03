//!

import { BlockedAccountsModel } from "../../database/models/block_account/blocked_account";
import {
  BlockAccountParams,
  BlockAccountResult,
} from "../../services/models/blocked_account_model";

//!
export default class BlockAccountService {
  //!
  //!
  public async blockAccount(
    params: BlockAccountParams
  ): Promise<BlockAccountResult> {
    try {
      const { userID, blockedAccountID } = params;

      const userDoc = await BlockedAccountsModel.findOne({ userID });

      if (!userDoc) {
        const newUserDoc = new BlockedAccountsModel({
          userID,
          blockedAccounts: [blockedAccountID],
        });

        await newUserDoc.save();
      } else {
        if (!userDoc.blockedAccounts.includes(blockedAccountID)) {
          userDoc.blockedAccounts.push(blockedAccountID);
          await userDoc.save();
        }
      }

      return { result: "Account blocked successfully" };
    } catch (error) {
      console.error("Error blocking account:", error);
      return { result: "Could not block account, try again" };
    }
  }
}
