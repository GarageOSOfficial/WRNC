import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { VehicleCoverPhoto } from '../../components/workspace/VehicleCoverPhoto';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

const mockRequestPermission = ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock;
const mockLaunchLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;

describe('VehicleCoverPhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPermission.mockResolvedValue({ granted: true });
  });

  it('shows the empty state and an Add Photo action when there is no photo', () => {
    const { getByText, getByLabelText } = render(
      <VehicleCoverPhoto hasPhoto={false} onUpload={jest.fn()} onRemove={jest.fn()} />
    );

    getByLabelText('Add vehicle cover photo');
    getByText('No photo');
    getByText('Add Photo');
  });

  it('shows Change Photo and Remove Photo actions when a photo exists', () => {
    const { getByText } = render(
      <VehicleCoverPhoto hasPhoto onUpload={jest.fn()} onRemove={jest.fn()} signedUrl="https://cdn.example.com/x.jpg" />
    );

    getByText('Change Photo');
    getByText('Remove Photo');
  });

  it('shows a loading indicator while the signed URL is hydrating', () => {
    const { getByText } = render(
      <VehicleCoverPhoto hasPhoto onUpload={jest.fn()} onRemove={jest.fn()} isLoadingUrl signedUrl={null} />
    );

    getByText('Loading photo…');
  });

  it('calls onUpload with the picked file', async () => {
    mockLaunchLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///cover.jpg', fileName: 'cover.jpg', mimeType: 'image/jpeg', fileSize: 100 }],
    });
    const onUpload = jest.fn().mockResolvedValue(undefined);

    const { getByText } = render(<VehicleCoverPhoto hasPhoto={false} onUpload={onUpload} onRemove={jest.fn()} />);
    fireEvent.press(getByText('Add Photo'));

    await waitFor(() => expect(onUpload).toHaveBeenCalledWith(
      expect.objectContaining({ uri: 'file:///cover.jpg', mimeType: 'image/jpeg' })
    ));
  });

  it('shows an error message when upload fails', async () => {
    mockLaunchLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///cover.jpg', fileName: 'cover.jpg', mimeType: 'image/jpeg', fileSize: 100 }],
    });
    const onUpload = jest.fn().mockRejectedValue(new Error('Network unavailable'));

    const { getByText } = render(<VehicleCoverPhoto hasPhoto={false} onUpload={onUpload} onRemove={jest.fn()} />);
    fireEvent.press(getByText('Add Photo'));

    await waitFor(() => getByText('Network unavailable'));
  });

  it('surfaces a permission error without exposing internals', async () => {
    mockRequestPermission.mockResolvedValue({ granted: false });
    const onUpload = jest.fn();

    const { getByText } = render(<VehicleCoverPhoto hasPhoto={false} onUpload={onUpload} onRemove={jest.fn()} />);
    fireEvent.press(getByText('Add Photo'));

    await waitFor(() => getByText(/photo library access is required/i));
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('calls onRemove when Remove Photo is pressed', async () => {
    const onRemove = jest.fn().mockResolvedValue(undefined);

    const { getByText } = render(
      <VehicleCoverPhoto hasPhoto onUpload={jest.fn()} onRemove={onRemove} signedUrl="https://cdn.example.com/x.jpg" />
    );
    fireEvent.press(getByText('Remove Photo'));

    await waitFor(() => expect(onRemove).toHaveBeenCalled());
  });
});
