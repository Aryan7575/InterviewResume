const mongoose = require ("mongoose")

const BlacklistTokenSchema = new mongoose.Schema({
    token:{
        type : String,
        required: [true,"token is required for blacklisting"]
    }
},{
    timestamps:true
})

const BlacklistTokensModel = mongoose.model('blacklisttokens', BlacklistTokenSchema)

module.exports = BlacklistTokensModel