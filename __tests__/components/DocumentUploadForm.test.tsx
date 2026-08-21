import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentUploadForm } from '../../components/workspace/DocumentUploadForm';

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

const mockGetDocumentAsync = DocumentPicker.getDocumentAsync as jest.Mock;

describe('DocumentUploadForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders all required category options', () => {
    const { getByText } = render(<DocumentUploadForm onSubmit={jest.fn()} />);

    ['Receipt', 'Registration', 'Insurance', 'Warranty', 'Manual', 'Diagram', 'Other'].forEach((label) => {
      getByText(label);
    });
  });

  it('requires a title before submitting', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.press(getByText('Upload Document'));

    await waitFor(() => getByText('Title is required.'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('requires a selected file before submitting', async () => {
    const onSubmit = jest.fn();
    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByLabelText('Title'), 'Brake receipt');
    fireEvent.press(getByText('Upload Document'));

    await waitFor(() => getByText('Select a file to upload.'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the title, category, and picked file', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///r.pdf', name: 'r.pdf', mimeType: 'application/pdf', size: 2048 }],
    });
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByLabelText('Title'), 'Brake receipt');
    fireEvent.press(getByText('Choose File'));
    await waitFor(() => getByText('Selected: r.pdf'));

    fireEvent.press(getByText('Insurance'));
    fireEvent.press(getByText('Upload Document'));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Brake receipt',
        category: 'insurance',
        file: expect.objectContaining({ name: 'r.pdf', uri: 'file:///r.pdf' }),
      })
    );
  });

  it('shows an upload error without exposing internals', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///r.pdf', name: 'r.pdf', mimeType: 'application/pdf', size: 2048 }],
    });
    const onSubmit = jest.fn().mockRejectedValue(new Error('Storage quota exceeded'));

    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByLabelText('Title'), 'Brake receipt');
    fireEvent.press(getByText('Choose File'));
    await waitFor(() => getByText('Selected: r.pdf'));
    fireEvent.press(getByText('Upload Document'));

    await waitFor(() => getByText('Storage quota exceeded'));
  });
});
