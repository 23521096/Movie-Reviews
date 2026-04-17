import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;
let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_DB_NAME).collection('reviews');
        } catch (e) {
            console.error(`Unable to establish a collection handle in ReviewsDAO: ${e}`);
        }
    }

    static async addReview(movieId, userInfo, review, date) {
        try {
            const reviewDoc = {
                name: userInfo.name,
                user_id: userInfo._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId),
            };
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: new ObjectId(reviewId) },
                { $set: { review: review, date: date } },
            );
            return updateResponse;
        } catch (e) {
            console.error(`unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({ user_id: userId, _id: new ObjectId(reviewId) });
            return deleteResponse;
        } catch (e) {
            console.error(`unable to delete review: ${e}`);
            return { error: e };
        }
    }
}
