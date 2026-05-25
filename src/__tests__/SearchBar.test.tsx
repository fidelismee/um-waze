import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('renders placeholder text', () => {
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search here" value="" onChangeText={() => {}} />,
    );
    expect(getByPlaceholderText('Search here')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search" value="" onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByPlaceholderText('Search'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });
});
