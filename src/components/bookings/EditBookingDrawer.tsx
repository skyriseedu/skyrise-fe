import React from 'react';

import {
  BookingDrawerBase,
  type AddBookingFormValues,
  type BookingDrawerBaseProps,
} from './AddBookingDrawer';

export type EditBookingDrawerProps = Omit<
  BookingDrawerBaseProps,
  'initialValues' | 'title' | 'submitLabel' | 'secondaryAction'
> & {
  initialValues: AddBookingFormValues;
  title?: string;
  onRemove?: () => void;
  removeLabel?: string;
  isRemoveDisabled?: boolean;
  isRemoveLoading?: boolean;
};

const EditBookingDrawer: React.FC<EditBookingDrawerProps> = ({
  title,
  onRemove,
  removeLabel = 'Remove',
  isRemoveDisabled,
  isRemoveLoading,
  ...rest
}) => (
  <BookingDrawerBase
    {...rest}
    title={title ?? 'Edit Consultation Booking'}
    submitLabel="Save"
    secondaryAction={
      onRemove
        ? {
            label: removeLabel,
            onClick: onRemove,
            kind: 'secondary',
            disabled: isRemoveDisabled,
            loading: isRemoveLoading,
          }
        : undefined
    }
  />
);

export default EditBookingDrawer;
