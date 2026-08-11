import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import NewActivityRoute from '../../app/(app)/vehicle/[id]/activity/new';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockMutate = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
  }),
  useLocalSearchParams: () => ({ id: 'veh-1' }),
}));

jest.mock('../../hooks/useVehicle', () => ({
  useVehicle: () => ({
    data: {
      id: 'veh-1',
      workspaceId: 'ws-1',
      year: 2012,
      make: 'Porsche',
      model: '911',
      trim: null,
      nickname: 'Benny',
      vin: null,
      engine: null,
      transmission: null,
      mileage: null,
      coverPhotoUrl: null,
      archivedAt: null,
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-08-01T00:00:00.000Z',
    },
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

jest.mock('../../hooks/useActivity', () => ({
  useCreateActivity: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('NewActivityRoute', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockBack.mockReset();
    mockMutate.mockReset();
  });

  it('does not submit when cost validation fails', () => {
    const { getByLabelText, getByText } = render(<NewActivityRoute />);

    fireEvent.changeText(getByLabelText('Title'), 'D/S Removal');
    fireEvent.changeText(getByLabelText('Cost'), '$abc');
    fireEvent.press(getByText('Save Activity'));

    expect(mockMutate).not.toHaveBeenCalled();
    expect(getByText('Cost must be a valid number.')).toBeTruthy();
  });

  it('submits a Journal Entry and redirects on success', () => {
    mockMutate.mockImplementation(
      (
        _payload: unknown,
        callbacks?: {
          onSuccess?: () => void;
        }
      ) => {
        callbacks?.onSuccess?.();
      }
    );

    const { getByLabelText, getByText } = render(<NewActivityRoute />);

    fireEvent.press(getByText('Journal Entry'));
    fireEvent.changeText(getByLabelText('Title'), 'D/S Removal');
    fireEvent.changeText(getByLabelText('Description'), 'drained fuel tank to Volvo, prepping for D/S removal tomorrow');
    fireEvent.changeText(getByLabelText('Odometer'), '120020');
    fireEvent.changeText(getByLabelText('Cost'), '$0');
    fireEvent.press(getByText('Save Activity'));

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleId: 'veh-1',
        userId: 'user-1',
        activityType: 'Journal Entry',
        title: 'D/S Removal',
        metadata: {
          odometer: 120020,
          cost: 0,
        },
      }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
    expect(mockReplace).toHaveBeenCalledWith('/vehicle/veh-1/timeline');
  });
});
