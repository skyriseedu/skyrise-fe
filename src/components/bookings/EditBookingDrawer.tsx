import React from 'react';

import {
  BookingDrawerBase,
  type AddBookingFormValues,
  type BookingDrawerBaseProps,
} from './AddBookingDrawer';

export type EditBookingDrawerProps = Omit<BookingDrawerBaseProps, 'initialValues' | 'title' | 'submitLabel'> & {
  initialValues: AddBookingFormValues;
};

const EditBookingDrawer: React.FC<EditBookingDrawerProps> = (props) => (
  <BookingDrawerBase
    {...props}
    title="Edit Consultation Booking"
    submitLabel="Save Changes"
  />
);

export default EditBookingDrawer;
