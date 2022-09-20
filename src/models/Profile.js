const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  designation: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
  },
  //   experience: [
  //     {
  //       title: {
  //         type: String,
  //         required: true,
  //       },
  //       company: {
  //         type: String,
  //         required: true,
  //       },
  //       location: {
  //         type: String,
  //       },
  //       from: {
  //         type: Date,
  //         required: true,
  //       },
  //       to: {
  //         type: Date,
  //       },
  //       current: {
  //         type: Boolean,
  //         default: false,
  //       },
  //       description: {
  //         type: String,
  //       },
  //     },
  //   ],
  //   education: [
  //     {
  //       school: {
  //         type: String,
  //         required: true,
  //       },
  //       degree: {
  //         type: String,
  //         required: true,
  //       },
  //       fieldofstudy: {
  //         type: String,
  //         required: true,
  //       },
  //       from: {
  //         type: Date,
  //         required: true,
  //       },
  //       to: {
  //         type: Date,
  //       },
  //       current: {
  //         type: Boolean,
  //         default: false,
  //       },
  //       description: {
  //         type: String,
  //       },
  //     },
  //   ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
})

module.exports = mongoose.model('Profile', ProfileSchema)
