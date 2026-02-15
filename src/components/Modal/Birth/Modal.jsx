// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// import { ruRU } from "@mui/x-date-pickers/locales"
// import dayjs from "dayjs"
// import 'dayjs/locale/ru'
// import { useState } from 'react'
// import { createPortal } from 'react-dom'

// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

// import useUpdateClientHandler from '../../../api/handlers/client/useUpdateClient.handler'
// import { useClient, useLogo, useParams } from '../../../zustand'
// import styles from './Modal.module.scss'

// const calendarStyle = {
// 	width: "100%",
// 	maxWidth: 260,
// 	backgroundColor: "transparent",
// 	color: "#fff",

// 	"& .MuiPickersCalendarHeader-root": {
// 		color: "#fff",
// 	},
// 	"& .MuiPickersCalendarHeader-label": {
// 		color: "#fff",
// 	},
// 	"& .MuiPickersCalendarHeader-switchViewIcon": {
// 		color: "#fff",
// 	},
// 	"& .MuiTypography-root": {
// 		color: "#fff",
// 	},
// 	"& .MuiSvgIcon-root": {
// 		color: "#fff",
// 	},

// 	"& .MuiDayCalendar-weekDayLabel": {
// 		color: "rgba(255, 255, 255, 0.6)",
// 	},

// 	"& .MuiPickersDay-root": {
// 		color: "#fff",
// 		"&.Mui-selected": {
// 			backgroundColor: "#c276e1",
// 			color: "#fff",
// 			"&:hover": { backgroundColor: "#ad5dc9" },
// 		},
// 		"&.MuiPickersDay-today": {
// 			borderColor: "#d4e43e",
// 			color: "#fff",
// 		},
// 	},

// 	"& .MuiPickersSlideTransition-root": { minHeight: '200px' },

// 	"& .MuiYearCalendar-root": {
// 		width: '100%',
// 		maxWidth: 'none',
// 		display: 'grid',
// 		gridTemplateColumns: 'repeat(3, 1fr)',
// 		gap: '8px'
// 	},

// 	"& .MuiPickersYear-yearButton": {
// 		color: "#fff",
// 		width: '100%',
// 		margin: 0,
// 		fontSize: "1rem",
// 		height: '40px',
// 		"&.Mui-selected": {
// 			backgroundColor: "#fbcc56",
// 			color: "#000",
// 		},
// 		"&:not(.Mui-selected)": {
// 			color: "#fff",
// 		}
// 	},

// 	"& .MuiMonthCalendar-root": {
// 		width: "100%",
// 		display: "grid",
// 		gridTemplateColumns: "repeat(3, 1fr)",
// 		gap: "8px",
// 		padding: "0 10px",
// 	},

// 	"& .MuiPickersMonth-monthButton": {
// 		color: "#fff",
// 		width: "100%",
// 		margin: 0,

// 		"&:not(.Mui-selected)": {
// 			color: "#fff",
// 		},

// 		"&.Mui-selected": {
// 			backgroundColor: "#2e77d2",
// 			color: "#fff",
// 		},
// 	},
// }

// const Modal = ({ onClose }) => {
// 	const client = useClient((state) => state.client)
// 	const branch = useParams((state) => state.branch)
// 	const [birth, setBirth] = useState(dayjs())
// 	const { updateClient } = useUpdateClientHandler()
// 	const logotype = useLogo((state) => state.logotype)

// 	const handleSubmit = async () => {
// 		if (!birth) return
// 		try {
// 			await updateClient({
// 				vk_user_id: client.vk_user_id,
// 				branch: branch,
// 				birth_date: birth.format("YYYY-MM-DD")
// 			})
// 			if (onClose) onClose();
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}

// 	return createPortal(
// 		<div className={styles.overlay}>
// 			<div className={styles.modal}>
// 				<div className={styles.header}>
// 					<img
// 						src={logotype !== null ? `${import.meta.env.VITE_BACKEND_DOMAIN}${logotype}` : '/LevelUpLogo.png'}
// 						alt="Logotype"
// 						className={styles.logotype}
// 					/>
// 				</div>

// 				<div className={styles.body}>
// 					<h3 className={styles.title}>ДЕНЬ РОЖДЕНИЯ 🎂</h3>
// 					<p className={styles.subtitle}>Укажите дату, чтобы получить подарок!</p>

// 					<div className={styles.calendarWrapper}>
// 						<LocalizationProvider
// 							dateAdapter={AdapterDayjs}
// 							adapterLocale="ru"
// 							localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
// 						>
// 							<DateCalendar
// 								className={styles.calendar}
// 								value={birth}
// 								onChange={(newValue) => setBirth(newValue)}
// 								openTo="year"
// 								views={['year', 'month', 'day']}
// 								maxDate={dayjs()}
// 								sx={calendarStyle}
// 							/>
// 						</LocalizationProvider>
// 					</div>

// 					<p className={styles.warning}>
// 						Изменить дату позже будет невозможно
// 					</p>

// 					<button className={styles.submitButton} onClick={handleSubmit}>
// 						ПОДТВЕРДИТЬ
// 					</button>
// 				</div>
// 			</div>
// 		</div>,
// 		document.body
// 	)
// }

// export default Modal


import dayjs from "dayjs"
import 'dayjs/locale/ru'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import useUpdateClientHandler from '../../../api/handlers/client/useUpdateClient.handler'
import { useClient, useLogo, useParams } from '../../../zustand'
import styles from './Modal.module.scss'

// Месяцы в родительном падеже для красивого отображения (1 Сентября 1990)
const MONTHS = [
	'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
	'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
];

const ITEM_HEIGHT = 40; // Высота одного элемента в барабане

// Вспомогательный компонент одной колонки (День, Месяц или Год)
const WheelColumn = ({ items, value, onChange, label }) => {
	const rootRef = useRef(null);
	const isScrolling = useRef(false);

	// Синхронизация скролла при изменении value извне (или при инициализации)
	useEffect(() => {
		if (rootRef.current && !isScrolling.current) {
			const index = items.indexOf(value);
			if (index !== -1) {
				rootRef.current.scrollTop = index * ITEM_HEIGHT;
			}
		}
	}, [value, items]);

	const handleScroll = (e) => {
		isScrolling.current = true;
		clearTimeout(window.scrollTimeout);

		// Debounce для завершения скролла
		window.scrollTimeout = setTimeout(() => {
			if (!rootRef.current) return;
			const scrollTop = rootRef.current.scrollTop;
			const index = Math.round(scrollTop / ITEM_HEIGHT);

			// Защита от выхода за границы
			const safeIndex = Math.max(0, Math.min(index, items.length - 1));

			if (items[safeIndex] !== value) {
				onChange(items[safeIndex]);
			}
			isScrolling.current = false;
		}, 100);
	};

	return (
		<div className={styles.wheelColumn}>
			<div
				className={styles.scrollContainer}
				ref={rootRef}
				onScroll={handleScroll}
			>
				<div className={styles.paddingItem} />
				{items.map((item, index) => (
					<div
						key={`${label}-${item}`}
						className={`${styles.wheelItem} ${item === value ? styles.selected : ''}`}
					>
						{item}
					</div>
				))}
				<div className={styles.paddingItem} />
			</div>
		</div>
	);
};

const Modal = ({ onClose }) => {
	const client = useClient((state) => state.client)
	const branch = useParams((state) => state.branch)
	const { updateClient } = useUpdateClientHandler()
	const logotype = useLogo((state) => state.logotype)

	// Инициализируем текущей датой
	const [selectedDate, setSelectedDate] = useState(dayjs());

	// Разбиваем на компоненты для удобства работы с барабанами
	const [day, setDay] = useState(selectedDate.date());
	const [monthIndex, setMonthIndex] = useState(selectedDate.month());
	const [year, setYear] = useState(selectedDate.year());

	// Генерация массивов данных
	const years = useMemo(() => {
		const currentYear = dayjs().year();
		const startYear = 1950;
		return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();
	}, []);

	const days = useMemo(() => {
		const daysInMonth = dayjs(`${year}-${monthIndex + 1}-01`).daysInMonth();
		return Array.from({ length: daysInMonth }, (_, i) => i + 1);
	}, [year, monthIndex]);

	// Обновляем общий стейт даты при изменении любого барабана
	useEffect(() => {
		// Проверка: если был выбран 31 день, а переключили на Февраль, нужно скорректировать день
		const maxDays = dayjs(`${year}-${monthIndex + 1}-01`).daysInMonth();
		let safeDay = day;
		if (day > maxDays) {
			safeDay = maxDays;
			setDay(safeDay);
		}

		const newDate = dayjs().year(year).month(monthIndex).date(safeDay);
		setSelectedDate(newDate);
	}, [day, monthIndex, year]);

	const handleSubmit = async () => {
		if (!selectedDate) return
		try {
			await updateClient({
				vk_user_id: client.vk_user_id,
				branch: branch,
				birth_date: selectedDate.format("YYYY-MM-DD")
			})
			if (onClose) onClose();
		} catch (error) {
			console.log(error)
		}
	}

	return createPortal(
		<div className={styles.overlay}>
			<div className={styles.modal}>
				{/* Кнопка закрытия (крестик) можно добавить при желании */}

				<div className={styles.header}>
					<img
						src='/LevelUpLogo.png'
						alt="Logotype"
						className={styles.logotype}
					/>
				</div>

				<div className={styles.body}>
					<h3 className={styles.title}>ДЕНЬ РОЖДЕНИЯ 🎂</h3>
					<p className={styles.subtitle}>Укажите дату, чтобы получить подарок!</p>

					<div className={styles.pickerWrapper}>
						{/* Линия выделения (Highlighter) */}
						<div className={styles.highlightBar}></div>

						{/* Барабан Дней */}
						<WheelColumn
							items={days}
							value={day}
							onChange={setDay}
							label="day"
						/>

						{/* Барабан Месяцев */}
						<WheelColumn
							items={MONTHS}
							value={MONTHS[monthIndex]}
							onChange={(val) => setMonthIndex(MONTHS.indexOf(val))}
							label="month"
						/>

						{/* Барабан Лет */}
						<WheelColumn
							items={years}
							value={year}
							onChange={setYear}
							label="year"
						/>
					</div>

					<p className={styles.warning}>
						Изменить дату позже будет невозможно
					</p>

					<button className={styles.submitButton} onClick={handleSubmit}>
						ПОДТВЕРДИТЬ
					</button>
				</div>
			</div>
		</div>,
		document.body
	)
}

export default Modal