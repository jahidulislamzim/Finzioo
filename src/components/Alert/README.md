# Global Alert System

This document outlines how to use the global `alert` system in the application.

## Overview

The `alert` system provides a simple and promise-based way to show modal dialogs to the user. It is designed to be called from anywhere in your application. The main method is `alert.show(options)`, which returns a promise that resolves when the user closes the alert.

## Usage

First, import the `alert` object into your component:

```javascript
import alert from '../../components/Alert/Alert';
```

Then, you can call the `show` method. Since it returns a promise, it is best to use `async/await`.

### `alert.show(options)`

This function displays a modal alert and returns a promise. The promise resolves with an object indicating how the alert was closed.

**Options:**

*   `title` (string, optional): The title of the alert.
*   `text` (string): The main text content of the alert.
*   `icon` (string, optional): The icon to display. Can be one of `'success'`, `'error'`, `'warning'`, or `'info'`.
*   `showCancelButton` (boolean, optional): If `true`, a cancel button is shown. Defaults to `false`.
*   `confirmButtonText` (string, optional): Custom text for the confirm button. Defaults to `'OK'`.
*   `cancelButtonText` (string, optional): Custom text for the cancel button. Defaults to `'Cancel'`.
*   `confirmButtonColor` (string, optional): A custom background color for the confirm button (e.g., a hex code).
*   `cancelButtonColor` (string, optional): A custom background color for the cancel button.

**Return Value (Promise)**

The promise resolves to an object with one of the following properties:

*   `{ isConfirmed: true }`: If the user clicked the confirm button.
*   `{ isDismissed: true }`: If the user clicked the cancel button, clicked outside the alert, or pressed the Escape key.

---

## Examples

### 1. A Simple Alert

This shows a basic alert with a title and text.

```javascript
import alert from '../../components/Alert/Alert';

const showSimpleAlert = async () => {
  await alert.show({
    title: 'Hello!',
    text: 'This is a simple alert message.'
  });
  console.log('Alert was closed.');
};
```

### 2. A Confirmation Dialog

This example shows a confirmation dialog with a "Yes" and "No" button. It checks the result to see which button the user clicked.

```javascript
import alert from '../../components/Alert/Alert';

const showConfirmation = async () => {
  const result = await alert.show({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  });

  if (result.isConfirmed) {
    alert.show({ title: 'Deleted!', text: 'The action was completed.', icon: 'success' });
  } else if (result.isDismissed) {
    alert.show({ title: 'Cancelled', text: 'The action was cancelled.', icon: 'error' });
  }
};
```

### 3. An Alert with an Icon

This shows how to display an alert with a predefined icon.

```javascript
import alert from '../../components/Alert/Alert';

const showErrorAlert = () => {
  alert.show({
    title: 'Oops...',
    text: 'Something went wrong!',
    icon: 'error'
  });
};
```

### 4. An Alert with Custom Button Colors

This shows how to override the default button colors.

```javascript
import alert from '../../components/Alert/Alert';

const showCustomColorAlert = async () => {
  await alert.show({
    title: 'Custom Colors!',
    text: 'This alert has custom button colors.',
    showCancelButton: true,
    confirmButtonColor: '#3498db',
    cancelButtonColor: '#95a5a6',
  });
};
```
