import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';

const mockMutateCreateVehicle = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../hooks/useWorkspace', () => ({
  useCurrentWorkspace: () => ({
    data: {
      id: 'ws-1',
      ownerId: 'user-1',
    },
  }),
}));

jest.mock('../../hooks/useVehicle', () => ({
  useVehicles: () => ({
    data: [],
    isLoading: false,
  }),
  useCreateVehicle: () => ({
    mutate: mockMutateCreateVehicle,
    isPending: false,
  }),
  useArchiveVehicle: () => ({
    mutate: jest.fn(),
  }),
  useRestoreVehicle: () => ({
    mutate: jest.fn(),
  }),
  useUpdateVehicle: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('../../hooks/useDocumentationScore', () => ({
  useDocumentationScore: () => ({
    data: { overallScore: 0 },
  }),
}));

describe('VehicleWorkspaceShell', () => {
  beforeEach(() => {
    mockMutateCreateVehicle.mockClear();
  });

  it('clears stale VIN length error after correcting VIN and resubmitting', () => {
    const { getAllByText, getByText, getByLabelText, queryByText } = render(<VehicleWorkspaceShell />);

    fireEvent.press(getAllByText('Create Vehicle')[0]);

    fireEvent.changeText(getByLabelText('Year'), '2000');
    fireEvent.changeText(getByLabelText('Make'), 'Honda');
    fireEvent.changeText(getByLabelText('Model'), 'Civic');

    fireEvent.changeText(getByLabelText('VIN'), '1234567890123456');
    fireEvent.press(getByText('Save'));

    expect(getByText('VIN must be 17 characters.')).toBeTruthy();

    fireEvent.changeText(getByLabelText('VIN'), '12345678901234567');
    fireEvent.press(getByText('Save'));

    expect(queryByText('VIN must be 17 characters.')).toBeNull();
    expect(mockMutateCreateVehicle).toHaveBeenCalledWith(
      expect.objectContaining({ vin: '12345678901234567' }),
      expect.any(Object)
    );
  });
});
