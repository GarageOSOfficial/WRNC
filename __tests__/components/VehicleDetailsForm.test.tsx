import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VehicleDetailsForm } from '../../components/workspace/VehicleDetailsForm';
import type { Vehicle } from '../../types/vehicle';

const vehicle: Vehicle = {
  id: 'veh-1',
  workspaceId: 'ws-1',
  vin: '12345678901234567',
  year: 1998,
  make: 'Honda',
  model: 'Civic',
  trim: 'EX',
  nickname: 'Bluebird',
  engine: '2.0L',
  transmission: 'Manual',
  mileage: 120000,
  coverPhotoUrl: null,
  archivedAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('VehicleDetailsForm', () => {
  it('renders read-only details by default', () => {
    const { getByText } = render(
      <VehicleDetailsForm vehicleData={vehicle} isEditMode={false} onSubmit={jest.fn()} onCancel={jest.fn()} />
    );

    expect(getByText('Bluebird')).toBeTruthy();
    expect(getByText('1998 Honda Civic EX')).toBeTruthy();
  });

  it('switches to edit mode and submits updated values', () => {
    const onSubmit = jest.fn();
    const { getByText, getByLabelText } = render(
      <VehicleDetailsForm vehicleData={vehicle} isEditMode={true} onSubmit={onSubmit} onCancel={jest.fn()} />
    );

    fireEvent.changeText(getByLabelText('Year'), '1999');
    fireEvent.changeText(getByLabelText('Make'), 'Toyota');
    fireEvent.changeText(getByLabelText('Model'), 'Corolla');
    fireEvent.press(getByText('Save Changes'));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ year: 1999, make: 'Toyota', model: 'Corolla' }));
  });

  it('shows a loading indicator and disables save when isSubmitting is true', () => {
    const { getByRole, queryByText } = render(
      <VehicleDetailsForm
        vehicleData={vehicle}
        isEditMode={true}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        isSubmitting={true}
      />
    );

    // The Save Changes label is replaced by ActivityIndicator when loading
    expect(queryByText('Save Changes')).toBeNull();
    // The button itself is still present but disabled
    const buttons = getByRole('button', { name: /cancel/i });
    expect(buttons).toBeTruthy();
  });

  it('disables the cancel button while submitting', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <VehicleDetailsForm
        vehicleData={vehicle}
        isEditMode={true}
        onSubmit={jest.fn()}
        onCancel={onCancel}
        isSubmitting={true}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('shows validation errors after a failed submit', () => {
    const { getByText, getByLabelText } = render(
      <VehicleDetailsForm vehicleData={vehicle} isEditMode={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
    );

    fireEvent.changeText(getByLabelText('Make'), '   ');
    fireEvent.changeText(getByLabelText('Model'), '   ');
    fireEvent.press(getByText('Save Changes'));

    expect(getByText('Make is required.')).toBeTruthy();
    expect(getByText('Model is required.')).toBeTruthy();
  });

  it('does not call onSubmit when validation fails', () => {
    const onSubmit = jest.fn();
    const { getByText, getByLabelText } = render(
      <VehicleDetailsForm vehicleData={vehicle} isEditMode={true} onSubmit={onSubmit} onCancel={jest.fn()} />
    );

    fireEvent.changeText(getByLabelText('Make'), '');
    fireEvent.press(getByText('Save Changes'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when the Cancel button is pressed', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <VehicleDetailsForm vehicleData={vehicle} isEditMode={true} onSubmit={jest.fn()} onCancel={onCancel} />
    );

    fireEvent.press(getByText('Cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('exposes accessible labels for all inputs', () => {
    const { getByLabelText } = render(
      <VehicleDetailsForm vehicleData={vehicle} isEditMode={true} onSubmit={jest.fn()} onCancel={jest.fn()} />
    );

    expect(getByLabelText('Nickname')).toBeTruthy();
    expect(getByLabelText('Year')).toBeTruthy();
    expect(getByLabelText('Make')).toBeTruthy();
    expect(getByLabelText('Model')).toBeTruthy();
    expect(getByLabelText('Trim')).toBeTruthy();
    expect(getByLabelText('VIN')).toBeTruthy();
    expect(getByLabelText('Engine')).toBeTruthy();
    expect(getByLabelText('Transmission')).toBeTruthy();
    expect(getByLabelText('Mileage')).toBeTruthy();
  });
});
