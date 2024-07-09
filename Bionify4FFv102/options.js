// filename: options.js

// Saves options to browser.storage
function save_options() {
  var flashColor = document.getElementById('flash').checked;
  var enableBionify = document.getElementById('enabled').checked;
  browser.storage.sync.set(
    {
      flashColor: flashColor,
      enableBionify: enableBionify,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
        window.close();
      }, 950);
    }
  );

  console.log('In save_options()');
}

// Restores select box and checkbox state using the preferences
// stored in browser.storage.
function restore_options() {
  // Use default value color = 'red' and flashColor = true.
  browser.storage.sync.get(
    {
      flashColor: false,
      enableBionify: true,
    },
    function (items) {
      if (browser.runtime.lastError) {
        console.error('Error retrieving options:', browser.runtime.lastError);
        return;
      }

      document.getElementById('flash').checked = items.flashColor;
      document.getElementById('enabled').checked = items.enableBionify;
    }
  );

  console.log('In restore_options()');
}

// Call restore_options when the DOM is ready
document.addEventListener('DOMContentLoaded', restore_options);

// Attach save_options to the 'click' event of the Save button
document.getElementById('save').addEventListener('click', save_options);
