const Telegraf = require('telegraf')

const bot = new Telegraf(1054222010:AAFXOJVR2jgqF-ddaM7gEWuPhwP0EtEeOws)
bot.command('server_ping', (ctx) => ctx.reply('Hello'))
bot.launch()

module.exports = bot;

