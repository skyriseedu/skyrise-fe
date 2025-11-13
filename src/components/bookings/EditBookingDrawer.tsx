import React from 'react';

import {
  BookingDrawerBase,
  type AddBookingFormValues,
  type BookingDrawerBaseProps,
} from './AddBookingDrawer';

export type EditBookingDrawerProps = Omit<
  BookingDrawerBaseProps,
  'initialValues' | 'title' | 'submitLabel'
> & {
  initialValues: AddBookingFormValues;
  title?: string;
};

const EditBookingDrawer: React.FC<EditBookingDrawerProps> = ({ title, ...rest }) => (
  <BookingDrawerBase
    {...rest}
    title={title ?? 'Edit Consultation Booking'}
    submitLabel="Save Changes"
  />
);

export default EditBookingDrawer;
