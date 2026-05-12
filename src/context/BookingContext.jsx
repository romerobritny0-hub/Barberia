import React, { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookedSlots, setBookedSlots] = useState([]);

  const addBookedSlot = useCallback((barberId, date, time) => {
    setBookedSlots(prev => {
      const exists = prev.some(slot => slot.barberId === barberId && slot.date === date && slot.time === time);
      if (exists) return prev;
      return [...prev, { barberId, date, time, bookedAt: new Date().toISOString() }];
    });
  }, []);

  const isSlotBooked = useCallback((barberId, date, time) => {
    return bookedSlots.some(slot => slot.barberId === barberId && slot.date === date && slot.time === time);
  }, [bookedSlots]);

  const getBookedSlotsForBarber = useCallback((barberId) => {
    return bookedSlots.filter(slot => slot.barberId === barberId);
  }, [bookedSlots]);

  return (
    <BookingContext.Provider value={{ bookedSlots, addBookedSlot, isSlotBooked, getBookedSlotsForBarber }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}