let body, schoolBell

const lessons = {
	0: '7:10-7:55',
	1: '8:00-8:45',
	2: '8:50-9:35',
	3: '9:40-10:25',
	4: '10:40-11:25',
	5: '11:30-12:15',
	6: '12:20-13:05',
	7: '13:10-13:55',
	8: '14:00-14:45',
	9: '14:50-15:35',
}

const api = {
	server: 'https://api.pqwouriqwuo.ct8.pl/api/AccessRights/View',
}

const prepareDOMElements = () => {
	body = document.querySelector('body')
	schoolBell = body.querySelector('.school__bell')
}

const prepareDOMEvents = () => {
	onStart()
}

const main = () => {
	prepareDOMElements()
	prepareDOMEvents()
	// window.addEventListener('load', checkLoading)
}

const onStart = () => {
	const date = getDateFromServer()

	setSchoolBell()
	setInterval(setSchoolBell, 60000);
	window.requestAnimationFrame(setTimeOnWebsite)
}

const now = () => new Date()
function leadingZero(i) {
	return i < 10 ? '0' + i : i
}

const setTimeOnWebsite = () => {
	const days = [
		'Niedziela',
		'Poniedziałek',
		'Wtorek',
		'Środa',
		'Czwartek',
		'Piątek',
		'Sobota',
	]
	document.querySelector('.footer__day').textContent = `${
		days[now().getDay()]
	}, ${leadingZero(now().getDate())}-${leadingZero(
		now().getMonth() + 1
	)}-${now().getFullYear()}`

	document.querySelector('.footer__time').textContent = `${leadingZero(
		now().getHours()
	)}:${leadingZero(now().getMinutes())}`

	window.requestAnimationFrame(setTimeOnWebsite)
}

const findLesson = ({ minute, hour }) => {
	;(hour = 8), (minute = 30)
	let lessonIndex = 0

	for (const lessonKey of Object.keys(lessons)) {
		const [startTimeStr, endTimeStr] = lessons[lessonKey].split('-')
		const [startHour, startMinute] = startTimeStr.split(':').map(Number)
		const [endHour, endMinute] = endTimeStr.split(':').map(Number)

		if (
			(hour > startHour || (hour === startHour && minute >= startMinute)) &&
			(hour < endHour || (hour === endHour && minute < endMinute))
		) {
			return { i: lessonIndex, isBreak: false }
		} else if (
			hour < startHour ||
			(hour === startHour && minute < startMinute)
		) {
			return { i: lessonIndex, isBreak: true }
		}

		lessonIndex++
	}
}

const setTimer = ({ i, isBreak }, { minute, hour }) => {
	;(hour = 8), (minute = 30)
	let remainingMinutes
	const currentTime = hour * 60 + minute
	const lesson = lessons[i]
	const time = lesson.split('-')

	if (isBreak) {
		const [startHour, startMinute] = time[0].split(':').map(Number)
		const startTime = startHour * 60 + startMinute
		remainingMinutes = startTime - currentTime
	} else {
		const [endHour, endMinute] = time[1].split(':').map(Number)
		const endTime = endHour * 60 + endMinute
		remainingMinutes = endTime - currentTime
	}

	return remainingMinutes
}

const isSchoolTime = ({ minute, hour }) => {
	const day = now().getDay()
	const keys = Object.keys(lessons)
	const firstLesson = lessons[keys[0]].split('-')
	const lastLesson = lessons[keys[keys.length - 1]].split('-')

	if (day >= 1 && day <= 5) {
		const [startHour, startMinute] = firstLesson[0].split(':').map(Number)
		const [endHour, endMinute] = lastLesson[1].split(':').map(Number)
		if (
			(hour > startHour || (hour === startHour && minute >= startMinute)) &&
			(hour < endHour || (hour === endHour && minute < endMinute))
		) {
			return true
		}
	}
	return false
}

const setSchoolBell = () => {
    const time = {minute: now().getMinutes(), hour: now().getHours()}
    
	if (isSchoolTime(time)) {
		const isLesson = findLesson(time)
		const timer = setTimer(isLesson, time)
		const text = isLesson.isBreak ? 'przerwy' : `lekcji ${isLesson.i}`
		const bgColor = isLesson.isBreak ? 'red' : ''

		schoolBell.textContent = `Do końca ${text} - ${timer}min`
		schoolBell.style.backgroundColor = bgColor
	} else {
		schoolBell.style.backgroundColor = 'green'
		schoolBell.textContent = 'Brak aktualnie lekcji'
	}
}

const getDateFromServer = async () => {
	// try {
	// 	const response = await fetch(api.server, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 	})
	// 	const data = await response.json()
	// 	if (data.ok) {
	// 		console.log(data)
	// 	}
	// } catch (error) {
	// 	console.error('Wystąpił błąd podczas wysyłania danych:', error.message)
	// }
}

document.addEventListener('DOMContentLoaded', main)
