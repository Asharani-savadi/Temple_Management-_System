import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import OnlineBookingServices from './OnlineBookingServices';

describe('OnlineBookingServices Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <OnlineBookingServices />
      </BrowserRouter>
    );
  };

  test('renders the page header', () => {
    renderComponent();
    expect(screen.getByText('Online Booking Services')).toBeInTheDocument();
    expect(screen.getByText('Choose a service to book')).toBeInTheDocument();
  });

  test('renders all three service cards', () => {
    renderComponent();
    expect(screen.getByText('Room Booking')).toBeInTheDocument();
    expect(screen.getByText('E-Hindi')).toBeInTheDocument();
    expect(screen.getByText('Marriage Hall')).toBeInTheDocument();
  });

  test('renders service descriptions', () => {
    renderComponent();
    expect(screen.getByText('Book accommodation rooms at the temple')).toBeInTheDocument();
    expect(screen.getByText('Make online donations and contributions')).toBeInTheDocument();
    expect(screen.getByText('Book the marriage hall for your special events')).toBeInTheDocument();
  });

  test('renders Book Now buttons for each service', () => {
    renderComponent();
    const buttons = screen.getAllByText('Book Now');
    expect(buttons).toHaveLength(3);
  });

  test('renders services info section', () => {
    renderComponent();
    expect(screen.getByText('Available Services')).toBeInTheDocument();
  });

  test('renders service details in info section', () => {
    renderComponent();
    expect(screen.getByText(/Reserve comfortable accommodation for your temple stay/)).toBeInTheDocument();
    expect(screen.getByText(/Make secure online donations to support temple activities/)).toBeInTheDocument();
    expect(screen.getByText(/Book our beautiful marriage hall for your wedding and celebrations/)).toBeInTheDocument();
  });

  test('service cards are clickable', () => {
    renderComponent();
    const serviceCards = screen.getAllByText('Book Now');
    expect(serviceCards[0]).toBeInTheDocument();
    expect(serviceCards[1]).toBeInTheDocument();
    expect(serviceCards[2]).toBeInTheDocument();
  });
});
