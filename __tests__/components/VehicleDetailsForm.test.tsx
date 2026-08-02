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
});
