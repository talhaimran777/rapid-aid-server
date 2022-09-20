const mongoose = require('mongoose')
const Conversation = require('../../models/Conversation')
const Message = require('../../models/Message')

// Post private message

const postMessage = async (req, res) => {
  const { to, message, user, oldMessages } = req.body
  const from = user.id
  const avatar = user.avatar

  try {
    const conversation = await Conversation.findOneAndUpdate(
      {
        recipients: {
          $in: [
            [to, from],
            [from, to],
          ],
        },
      },
      {
        recipients: [to, from],
        lastMessage: message,
        date: Date.now(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    if (conversation) {
      // console.log(conversation)
      // console.log(oldConversations)

      const newMessage = new Message({
        conversation: conversation._id,
        to,
        from,
        avatar,
        message,
      })

      oldMessages.push(newMessage)
      const result = await newMessage.save()
      req.io.emit(`${to}`, oldMessages)
      req.io.emit(`${from}`, oldMessages)
      res.status(201).json({ status: 'SUCCESS', message: result })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'FAILED', error: err.response })
  }
}

const getMessages = async (req, res) => {
  const { user } = req.body
  const { id } = req.params

  const user1Id = user.id
  const user2Id = id

  try {
    const messages = await Message.find()
      .or([
        {
          to: {
            $in: [user1Id, user2Id],
          },
          from: {
            $in: [user1Id, user2Id],
          },
        },
      ])
      .sort({ _id: 1 })
      .populate([
        { path: 'to', select: 'name' },
        { path: 'from', select: 'name' },
      ])

    if (messages) {
      res.status(200).json({ status: 'SUCCESS', messages })
    } else {
      res.status(200).json({ status: 'SUCCESS', messages: [] })
    }
    // res.status(200).json({ status: 'ok', tasks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'FAILED', error: err.response })
  }

  // return res.status(200).json({ status: 'SUCCESS', data: { ...req.body } })
  // let user1 = mongoose.Types.ObjectId(jwtUser.id);
  // let user2 = mongoose.Types.ObjectId(req.query.userId);
  // Message.aggregate([
  //     {
  //         $lookup: {
  //             from: 'users',
  //             localField: 'to',
  //             foreignField: '_id',
  //             as: 'toObj',
  //         },
  //     },
  //     {
  //         $lookup: {
  //             from: 'users',
  //             localField: 'from',
  //             foreignField: '_id',
  //             as: 'fromObj',
  //         },
  //     },
  // ])
  //     .match({
  //         $or: [
  //             { $and: [{ to: user1 }, { from: user2 }] },
  //             { $and: [{ to: user2 }, { from: user1 }] },
  //         ],
  //     })
  //     .project({
  //         'toObj.password': 0,
  //         'toObj.__v': 0,
  //         'toObj.date': 0,
  //         'fromObj.password': 0,
  //         'fromObj.__v': 0,
  //         'fromObj.date': 0,
  //     })
  //     .exec((err, messages) => {
  //         if (err) {
  //             console.log(err);
  //             res.setHeader('Content-Type', 'application/json');
  //             res.end(JSON.stringify({ message: 'Failure' }));
  //             res.sendStatus(500);
  //         } else {
  //             res.send(messages);
  //         }
  //     });
}

module.exports = {
  postMessage,
  getMessages,
}
