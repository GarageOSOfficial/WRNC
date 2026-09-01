import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';

const mockUpdateVehicleMutate = jest.fn();

const mockWorkspaceQuery: {
  data: { id: string; ownerId: string } | undefined;
  error: Error | null;
  isLoading: boolean;
  isPending: boolean;
} = {
  data: {
    id: 'ws-1',
    ownerId: 'user-1',
  },
  error: null,
  isLoading: false,
  isPending: false,
};

const mockVehiclesQuery: {
  data: {
    id: string;
    workspaceId: string;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    nickname: string | null;
    vin: string | null;
    engine: string | null;
    transmission: string | null;
    mileage: number | null;
    coverPhotoUrl: string | null;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }[] | undefined;
  error: Error | null;
  isLoading: boolean;
  isPending: boolean;
  isFetching: boolean;
} = {
  data: [],
  error: null,
  isLoading: false,
  isPending: false,
  isFetching: false,
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../hooks/useWorkspace', () => ({
  useCurrentWorkspace: () => mockWorkspaceQuery,
}));

jest.mock('../../hooks/useVehicle', () => ({
  useVehicles: () => mockVehiclesQuery,
  useCreateVehicle: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useArchiveVehicle: () => ({
    mutate: jest.fn(),
  }),
  useRestoreVehicle: () => ({
    mutate: jest.fn(),
  }),
  useUpdateVehicle: () => ({
    mutate: mockUpdateVehicleMutate,
    isPending: false,
  }),
}));

jest.mock('../../hooks/useDocumentationScore', () => ({
  useDocumentationScore: () => ({
    data: { overallScore: 0 },
  }),
}));

describe('VehicleWorkspaceShell loading and empty states', () => {
  it('places the loaded Vehicles content inside a safe-area boundary', () => {
    const screen = render(<VehicleWorkspaceShell />);
    const boundary = screen.UNSAFE_getByType(SafeAreaView);
    expect(boundary.props.testID).toBe('vehicles-safe-area');
    const scroll = boundary.findByType(ScrollView);
    expect(scroll.props.contentContainerStyle).toEqual({ padding: 16, paddingBottom: 160 });
    expect(scroll.props.automaticallyAdjustKeyboardInsets).toBe(true);
    expect(scroll.props.keyboardDismissMode).toBe('interactive');
    expect(screen.getByText('Vehicles')).toBeTruthy();
  });
  beforeEach(() => {
    mockWorkspaceQuery.data = {
      id: 'ws-1',
      ownerId: 'user-1',
    };
    mockWorkspaceQuery.error = null;
    mockWorkspaceQuery.isLoading = false;
    mockWorkspaceQuery.isPending = false;

    mockVehiclesQuery.data = [];
    mockVehiclesQuery.error = null;
    mockVehiclesQuery.isLoading = false;
    mockVehiclesQuery.isPending = false;
    mockVehiclesQuery.isFetching = false;

    mockUpdateVehicleMutate.mockReset();
  });

  it('does not render empty state while workspace query is pending', () => {
    mockWorkspaceQuery.data = undefined;
    mockWorkspaceQuery.isLoading = true;
    mockWorkspaceQuery.isPending = true;

    const { getByText, getByTestId, queryByText } = render(<VehicleWorkspaceShell />);

    expect(getByText('Loading vehicles…')).toBeTruthy();
    expect(getByTestId('workspace-shell-dark-state')).toBeTruthy();
    expect(queryByText('No vehicles yet')).toBeNull();
  });

  it('does not render empty state while initial vehicles query is pending', () => {
    mockWorkspaceQuery.data = {
      id: 'ws-1',
      ownerId: 'user-1',
    };
    mockVehiclesQuery.data = undefined;
    mockVehiclesQuery.isLoading = true;
    mockVehiclesQuery.isPending = true;
    mockVehiclesQuery.isFetching = true;

    const { getByText, getByTestId, queryByText } = render(<VehicleWorkspaceShell />);

    expect(getByText('Loading vehicles…')).toBeTruthy();
    expect(getByTestId('workspace-shell-dark-state')).toBeTruthy();
    expect(queryByText('No vehicles yet')).toBeNull();
  });

  it('renders workspace query errors inside the dark state container', () => {
    mockWorkspaceQuery.data = undefined;
    mockWorkspaceQuery.error = new Error('Workspace failed');
    mockWorkspaceQuery.isLoading = false;
    mockWorkspaceQuery.isPending = false;

    const { getByText, getByTestId } = render(<VehicleWorkspaceShell />);

    expect(getByText('Unable to load your garage.')).toBeTruthy();
    expect(getByText('Workspace failed')).toBeTruthy();
    expect(getByTestId('workspace-shell-dark-state')).toBeTruthy();
  });

  it('renders vehicle query errors inside the dark state container when no vehicle data exists', () => {
    mockVehiclesQuery.data = undefined;
    mockVehiclesQuery.error = new Error('Vehicles failed');
    mockVehiclesQuery.isLoading = false;
    mockVehiclesQuery.isPending = false;
    mockVehiclesQuery.isFetching = false;

    const { getByText, getByTestId } = render(<VehicleWorkspaceShell />);

    expect(getByText('Unable to load vehicles.')).toBeTruthy();
    expect(getByText('Vehicles failed')).toBeTruthy();
    expect(getByTestId('workspace-shell-dark-state')).toBeTruthy();
  });

  it('renders empty state when vehicles query resolves with an empty list', () => {
    mockWorkspaceQuery.data = {
      id: 'ws-1',
      ownerId: 'user-1',
    };
    mockVehiclesQuery.data = [];
    mockVehiclesQuery.isLoading = false;
    mockVehiclesQuery.isPending = false;
    mockVehiclesQuery.isFetching = false;

    const { getByText } = render(<VehicleWorkspaceShell />);

    expect(getByText('No vehicles yet')).toBeTruthy();
  });

  it('renders Benny vehicle card when vehicles query resolves with data', () => {
    mockWorkspaceQuery.data = {
      id: 'ws-1',
      ownerId: 'user-1',
    };
    mockVehiclesQuery.data = [
      {
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
    ];
    mockVehiclesQuery.isLoading = false;
    mockVehiclesQuery.isPending = false;
    mockVehiclesQuery.isFetching = false;

    const { getByText, queryByText } = render(<VehicleWorkspaceShell />);

    expect(getByText('Benny')).toBeTruthy();
    expect(queryByText('No vehicles yet')).toBeNull();
  });

  it('applies updated vehicle data immediately after edit success', () => {
    const baseVehicle = {
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
    };

    mockVehiclesQuery.data = [baseVehicle];

    mockUpdateVehicleMutate.mockImplementation(
      (
        _variables: unknown,
        callbacks?: {
          onSuccess?: (vehicle: typeof baseVehicle) => void;
        }
      ) => {
        callbacks?.onSuccess?.({
          ...baseVehicle,
          nickname: 'Benny V2',
          updatedAt: '2026-08-11T04:30:00.000Z',
        });
      }
    );

    const { getAllByText, getByLabelText, getByText } = render(<VehicleWorkspaceShell />);

    fireEvent.press(getAllByText('Benny')[0]);
    fireEvent.press(getByText('Edit'));
    fireEvent.changeText(getByLabelText('Nickname'), 'Benny V2');
    fireEvent.press(getByText('Save Changes'));

    expect(getByText('Benny V2')).toBeTruthy();
    expect(mockUpdateVehicleMutate).toHaveBeenCalled();
  });

  it('keeps edit mode open and shows an error when vehicle update fails', () => {
    const baseVehicle = {
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
    };

    mockVehiclesQuery.data = [baseVehicle];
    mockUpdateVehicleMutate.mockImplementation(
      (
        _variables: unknown,
        callbacks?: {
          onError?: (error: unknown) => void;
        }
      ) => {
        callbacks?.onError?.({ message: 'update failed' });
      }
    );

    const { getAllByText, getByLabelText, getByText } = render(<VehicleWorkspaceShell />);

    fireEvent.press(getAllByText('Benny')[0]);
    fireEvent.press(getByText('Edit'));
    fireEvent.changeText(getByLabelText('Nickname'), 'Still Editing');
    fireEvent.press(getByText('Save Changes'));

    expect(getByText('update failed')).toBeTruthy();
    expect(getByText('Save Changes')).toBeTruthy();
  });
});
