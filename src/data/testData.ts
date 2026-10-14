import { CustomerInfo } from '../models/Order';
import { Product } from '../models/Product';
import { TestUser } from '../models/User';

export const USERS: Record<string, TestUser> = {
  standard: {
    username: 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: 'standard',
    description: 'Standard active user with full permissions',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: 'locked_out',
    description: 'Locked out account to verify error handling',
  },
  problem: {
    username: 'problem_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: 'problem',
    description: 'User with broken images and form submission bugs',
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: 'performance_glitch',
    description: 'User experiencing artificial server latency',
  },
  error: {
    username: 'error_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: 'error',
    description: 'User generating client-side JavaScript errors',
  },
  visual: {
    username: 'visual_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    role: 'visual',
    description: 'User with visual defects and layout misalignments',
  },
};

export const PRODUCTS: Record<string, Product> = {
  backpack: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: 29.99,
  },
  bikeLight: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    description: "A red light for your bike, or to wear in the dark. It doesn't suit your style, your looks, or your hair, but you're definitely visible.",
    price: 9.99,
  },
  boltTShirt: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
    price: 15.99,
  },
  fleeceJacket: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    description: "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day in the office.",
    price: 49.99,
  },
  onesie: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    description: "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: 7.99,
  },
  redTShirt: {
    id: 'test.allthethings()-t-shirt-(red)',
    name: 'Test.allTheThings() T-Shirt (Red)',
    description: 'This classic Sauce Labs t-shirt is perfect for every day wear. Regular-fit tee in super soft jersey cotton with red classic logo on chest.',
    price: 15.99,
  },
};

export const DEFAULT_CUSTOMER: CustomerInfo = {
  firstName: 'Jane',
  lastName: 'Doe',
  postalCode: '90210',
};

export const AUTH_ERRORS = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
};

export const CHECKOUT_ERRORS = {
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
};
