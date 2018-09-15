const request = require('./requestPromise')

module.exports = class methods {
    constructor(access_token) {
        this.ACCESS_TOKEN = 'EAARtrRJkBB0BACZBbpVYf4B7NQFSl3udM0VZCZA2xsaZCZB10qxaDVt8Fpjs6dydXP6ZAwkMA5fXSmzuRPlFogPhnIUnOZAerXKw5fSbm8DigtlREdZAHntJzXhohmNRgJZAiINiQ3F2Rwle8mZCv0iJwqF3RX6ZALZAtkRIkmDo7tJjZCPjwjFkZCtIZA5';
    }

    async sendText(text, id) {

        const json = {
            recipient: { id },
            message: { text }
        }

        const res = await request({
            url: 'https://graph.facebook.com/v2.11/me/messages',
            qs: {
                access_token: this.ACCESS_TOKEN
            },
            json,
            method: 'POST'
        })

        console.log('Facebook says: ', res)
    }

    getMessageObject(json) {
        const message = json.entry[0].messaging[0].message.text
        const problemStatement = json.entry[0].messaging[0].message.nlp.entities.problemStatement
        const subject = json.entry[0].messaging[0].message.nlp.entities.subject
        const intent = json.entry[0].messaging[0].message.nlp.entities.intent
        const id = json.entry[0].messaging[0].sender.id
        return {message, id, problemStatement,subject,intent}
    }
}