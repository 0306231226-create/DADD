const { Vote } = require('../../models');

class VoteRepository {
    async findVote(users_id, posts_id) {
        return await Vote.findOne({ where: { users_id, posts_id } });
    }

    async create(data) {
        return await Vote.create(data);
    }

    async delete(users_id, posts_id) {
        return await Vote.destroy({ where: { users_id, posts_id } });
    }

    async update(users_id, posts_id, vote_type) {
        return await Vote.update({ vote_type }, { where: { users_id, posts_id } });
    }

    async countTotalScore(posts_id) {
        const upvotes = await Vote.count({ where: { posts_id, vote_type: 'upvote' } });
        const downvotes = await Vote.count({ where: { posts_id, vote_type: 'downvote' } });
        return upvotes - downvotes;
    }
    

async deleteVote(users_id, posts_id) {
    return await Vote.destroy({ 
        where: { users_id, posts_id } 
    });
}
}

module.exports = new VoteRepository();