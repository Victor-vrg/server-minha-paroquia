import { Db } from 'mongodb';
import { getDatabaseInstance } from '../database/mongo';
import FeedbackModel from '../models/feedbackModel';

class FeedbackRepository {
  private collectionName: string;

  constructor() {
    this.collectionName = 'Feedbacks';
  }

  public async addFeedback(feedback: FeedbackModel): Promise<void> {
    const dbInstance: Db = getDatabaseInstance();
    await dbInstance.collection<FeedbackModel>(this.collectionName).insertOne(feedback);
  }

  public async getFeedbacks(): Promise<FeedbackModel[]> {
    const dbInstance: Db = getDatabaseInstance();
    return await dbInstance.collection<FeedbackModel>(this.collectionName).find().sort({ _id: -1 }).toArray();
  }

}

export default FeedbackRepository;
