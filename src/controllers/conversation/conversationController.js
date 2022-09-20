const mongoose = require('mongoose')
const Conversation = require('../../models/Conversation')

// GETTING CONVERSATIONS IN WHICH TO IS ME
const getConversations = async (req, res) => {
  const { user } = req.body

  //   console.log(user.id)
  try {
    // GETTING CONVERSATIONS IN WHICH TO IS ME
    const conversations = await Conversation.find({
      recipients: {
        $in: [user.id],
      },
    })
      .populate({
        path: 'recipients',
        match: {
          _id: { $ne: user.id },
        },
      })
      .sort({ date: -1 })

    if (conversations.length > 0) {
      res.json({
        status: 'SUCCESS',
        conversations,
      })
    } else {
      res.json({
        status: 'SUCCESS',
        conversations: [],
      })
    }
  } catch (err) {
    res.json({
      status: 'FAILED',
      error: err.response,
    })
  }
}

module.exports = {
  getConversations,
}
