import React, { useState, useEffect } from 'react';
import CaretLeft from '../../assets/caret-left.svg?react';
import CaretRight from '../../assets/caret-right.svg?react';

interface CustomCalendarProps {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate: propSelectedDate,
  onDateSelect,
  className = '',
}) => {
  // Initialize currentDate to the selected date's month if provided, otherwise current month
  const [currentDate, setCurrentDate] = useState(() => {
    if (propSelectedDate) {
      return new Date(
        propSelectedDate.getFullYear(),
        propSelectedDate.getMonth(),
        1
      );
    }
    return new Date(); // Current month
  });
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(
    propSelectedDate || null
  );

  const selectedDate =
    propSelectedDate !== undefined ? propSelectedDate : internalSelectedDate;

  // Update currentDate when propSelectedDate changes to navigate to the selected month
  useEffect(() => {
    if (propSelectedDate) {
      setCurrentDate(
        new Date(propSelectedDate.getFullYear(), propSelectedDate.getMonth(), 1)
      );
    }
  }, [propSelectedDate]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const now = new Date();
    return (
      day === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear()
    );
  };

  const isPast = (day: number | null) => {
    if (!day) return false;
    const now = new Date();
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const handleDateClick = (day: number | null) => {
    if (day) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
        12, // Set to noon to avoid timezone issues
        0,
        0,
        0
      );

      if (onDateSelect) {
        onDateSelect(newDate);
      } else {
        // Otherwise use internal state
        setInternalSelectedDate(newDate);
      }
    }
  };

  const isSelectedDate = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div
      className={`mx-auto w-80 rounded-2xl bg-white p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-h4 font-medium text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="bg-secondary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors"
          >
            <CaretLeft className="text-primary h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="bg-secondary hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors"
          >
            <CaretRight className="text-primary h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const selected = isSelectedDate(day);
          const today = isToday(day);
          const past = isPast(day);
          const base =
            'h-8 w-8 rounded-full text-sm font-medium transition-all duration-200';
          const state = !day
            ? 'invisible'
            : selected
              ? 'bg-primary text-white shadow-lg'
              : past
                ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
          const todayRing =
            day && today && !selected
              ? 'ring-2 ring-primary ring-offset-1'
              : '';
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={!day}
              className={`${base} ${state} ${todayRing} ${day ? 'cursor-pointer' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
