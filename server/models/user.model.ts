
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: {
    address: string;
    verified: boolean;
  };
  // Define other fields based on your database design
}

const userSchema: Schema = new Schema({
  email: {
    address: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  // Define other fields based on your database design
  password: {
    type: String,
    required: true
  },
  name: {
      type: String,
      required: true
  },
  gender: String,
  designation: [{
      value: String,
      label: String
  }],
  location: [{
      value: String,
      label: String
  }],
  about: String,
  sharelink: String,
  areaOfExpertise: [{
      value: String,
      label: String
  }],
  image: String,
  experience: String,
  lastLoggedInAt: {
      type: Date,
      default: Date.now
  },
  isAMentor: Boolean,
  hasAcceptedTANDC: Boolean,
  deleted: Boolean,
  educationalQualification: String,
  refreshTokens: [{
      token: String,
      exp: Number
  }],
  otpInfo: {
      otp: Number,
      exp: Number
  },
  languages: [{
      value: String,
      label: String
  }],
  rating: {
      type: Schema.Types.Mixed // Mixed type for storing various data types in rating
  },
  preferedLanguages: String
  });

const User = mongoose.model<IUser>('user', userSchema);

export default User;







// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     email: {
//         address: {
//             type: String,
//             required: true
//         },
//         verified: {
//             type: Boolean,
//             default: false
//         }
//     },
    // password: {
    //     type: String,
    //     required: true
    // },
    // name: {
    //     type: String,
    //     required: true
    // },
    // gender: String,
    // designation: [{
    //     value: String,
    //     label: String
    // }],
    // location: [{
    //     value: String,
    //     label: String
    // }],
    // about: String,
    // sharelink: String,
    // areaOfExpertise: [{
    //     value: String,
    //     label: String
    // }],
    // image: String,
    // experience: String,
    // lastLoggedInAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // isAMentor: Boolean,
    // hasAcceptedTANDC: Boolean,
    // deleted: Boolean,
    // educationalQualification: String,
    // refreshTokens: [{
    //     token: String,
    //     exp: Number
    // }],
    // otpInfo: {
    //     otp: Number,
    //     exp: Number
    // },
    // languages: [{
    //     value: String,
    //     label: String
    // }],
    // rating: {
    //     type: Schema.Types.Mixed // Mixed type for storing various data types in rating
    // },
    // preferedLanguages: String
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
