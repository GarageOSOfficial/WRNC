import React from 'react';
import { render } from '@testing-library/react-native';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';

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
  data: Array<{
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
  }> | undefined;
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
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('../../hooks/useDocumentationScore', () => ({
  useDocumentationScore: () => ({
    data: { overallScore: 0 },
  }),
}));

describe('VehicleWorkspaceShell loading and empty states', () => {
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
  });

  it('does not render empty state while workspace query is pending', () => {
    mockWorkspaceQuery.data = undefined;
    mockWorkspaceQuery.isLoading = true;
    mockWorkspaceQuery.isPending = true;

    const { getByText, queryByText } = render(<VehicleWorkspaceShell />);

    expect(getByText('Loading vehicles…')).toBeTruthy();
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

    const { getByText, queryByText } = render(<VehicleWorkspaceShell />);

    expect(getByText('Loading vehicles…')).toBeTruthy();
    expect(queryByText('No vehicles yet')).toBeNull();
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
});
