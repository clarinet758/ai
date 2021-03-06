import 藍 from '../../ai';
import IModule from '../../module';
import MessageLike from '../../message-like';
import serifs from '../../serifs';

export default class TimerModule implements IModule {
	public readonly name = 'timer';
	private ai: 藍;

	public install = (ai: 藍) => {
		this.ai = ai;
	}

	public onMention = (msg: MessageLike) => {
		const secondsQuery = (msg.text || '').match(/([0-9]+)秒/);
		const minutesQuery = (msg.text || '').match(/([0-9]+)分/);
		const hoursQuery = (msg.text || '').match(/([0-9]+)時間/);

		const seconds = secondsQuery ? parseInt(secondsQuery[1], 10) : 0;
		const minutes = minutesQuery ? parseInt(minutesQuery[1], 10) : 0;
		const hours = hoursQuery ? parseInt(hoursQuery[1], 10) : 0;

		if (secondsQuery || minutesQuery || hoursQuery) {
			if ((seconds + minutes + hours) == 0) {
				msg.reply(serifs.timer.invalid);
				return true;
			}

			const time =
				(1000 * seconds) +
				(1000 * 60 * minutes) +
				(1000 * 60 * 60 * hours);

			if (time > 86400000) {
				msg.reply(serifs.timer.tooLong);
				return true;
			}

			msg.reply(serifs.timer.set);

			const str = `${hours ? hoursQuery[0] : ''}${minutes ? minutesQuery[0] : ''}${seconds ? secondsQuery[0] : ''}`;

			setTimeout(() => {
				const name = msg.friend.name;
				this.ai.sendMessage(msg.userId, {
					text: serifs.timer.notify(str, name)
				});
			}, time);

			return true;
		} else {
			return false;
		}
	}
}
