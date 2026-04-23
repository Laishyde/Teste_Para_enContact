import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { useApp, useAppActions } from '../context/AppContext';
import '../styles/globals.css';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const { addToast, scheduleItems } = useAppActions();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const monthNames = state.language === 'pt' 
    ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const weekDays = state.language === 'pt'
    ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleSchedule = () => {
    if (!selectedDate || !title.trim()) {
      addToast({
        type: 'warning',
        title: state.language === 'pt' ? 'Campos obrigatórios' : 'Required fields',
        message: state.language === 'pt' 
          ? 'Por favor, selecione uma data e preencha o título' 
          : 'Please select a date and fill in the title'
      });
      return;
    }

    // Schedule the items
    const formattedDate = selectedDate.toISOString().split('T')[0]; // eslint-disable-line
    scheduleItems({
      date: formattedDate,
      time: selectedTime,
      title: title.trim(),
      description: description.trim()
    });

    // Show success toast
    addToast({
      type: 'info',
      title: state.language === 'pt' ? '📅 Agendado com Sucesso!' : '📅 Scheduled Successfully!',
      message: state.language === 'pt' 
        ? `"${title}" foi agendado para ${selectedDate.toLocaleDateString()} às ${selectedTime}. Você pode encontrar na aba Agendamentos.` 
        : `"${title}" was scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}. You can find it in the Scheduled tab.`,
      duration: 5000
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedDate(null);
    setSelectedTime('09:00');
    onClose();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : isToday 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{
            backgroundColor: isSelected 
              ? 'var(--color-primary)' 
              : isToday 
                ? 'var(--color-primary)20' 
                : undefined
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="card w-full max-w-2xl max-h-[90vh] overflow-auto animate-scale-in"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <CalendarIcon size={24} style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {state.language === 'pt' ? 'Agendar Compromisso' : 'Schedule Appointment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Calendar */}
          <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="btn btn-icon"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="btn btn-icon"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium p-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Selected Date Display */}
            {selectedDate && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {state.language === 'pt' ? 'Data selecionada:' : 'Selected date:'} {selectedDate.toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {state.language === 'pt' ? 'Horário:' : 'Time:'}
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="input"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {state.language === 'pt' ? 'Título:' : 'Title:'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={state.language === 'pt' ? 'Título do compromisso' : 'Appointment title'}
                className="input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {state.language === 'pt' ? 'Descrição:' : 'Description:'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={state.language === 'pt' ? 'Descrição (opcional)' : 'Description (optional)'}
                rows={3}
                className="input resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              {state.language === 'pt' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleSchedule}
              className="btn btn-primary"
            >
              {state.language === 'pt' ? 'Agendar' : 'Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
