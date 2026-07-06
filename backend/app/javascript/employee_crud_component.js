angular.module('employeeApp', []).component('employeeCrud', {
  template: [
    '<section style="max-width: 960px; margin: 2rem auto; font-family: Arial, sans-serif;">',
    '  <h1>Employee Management</h1>',
    '  <p style="color: #4b5563;">Manage employees through a pure Angular component backed by Rails JSON endpoints.</p>',
    '  <div style="margin-bottom: 1.5rem; padding: 1rem; border: 1px solid #d1d5db; border-radius: 8px; background: #f9fafb;">',
    '    <h2 style="margin-top: 0;">{{ $ctrl.isEditing ? "Edit Employee" : "New Employee" }}</h2>',
    '    <form ng-submit="$ctrl.submitEmployee()">',
    '      <div style="display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">',
    '        <input ng-model="$ctrl.form.name" placeholder="Name" required style="padding: 0.6rem;" />',
    '        <input ng-model="$ctrl.form.email" placeholder="Email" type="email" required style="padding: 0.6rem;" />',
    '        <input ng-model="$ctrl.form.department" placeholder="Department" required style="padding: 0.6rem;" />',
    '        <input ng-model="$ctrl.form.position" placeholder="Position" required style="padding: 0.6rem;" />',
    '      </div>',
    '      <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">',
    '        <button type="submit" style="padding: 0.6rem 1rem;">{{ $ctrl.isEditing ? "Update Employee" : "Create Employee" }}</button>',
    '        <button type="button" ng-if="$ctrl.isEditing" ng-click="$ctrl.cancelEdit()" style="padding: 0.6rem 1rem;">Cancel</button>',
    '      </div>',
    '    </form>',
    '    <p ng-if="$ctrl.message" style="margin-top: 0.75rem; color: #047857;">{{ $ctrl.message }}</p>',
    '    <p ng-if="$ctrl.errorMessage" style="margin-top: 0.75rem; color: #b91c1c;">{{ $ctrl.errorMessage }}</p>',
    '  </div>',
    '  <table style="width: 100%; border-collapse: collapse;">',
    '    <thead>',
    '      <tr style="background: #f3f4f6;">',
    '        <th style="text-align: left; padding: 0.75rem;">Name</th>',
    '        <th style="text-align: left; padding: 0.75rem;">Email</th>',
    '        <th style="text-align: left; padding: 0.75rem;">Department</th>',
    '        <th style="text-align: left; padding: 0.75rem;">Position</th>',
    '        <th style="text-align: left; padding: 0.75rem;">Actions</th>',
    '      </tr>',
    '    </thead>',
    '    <tbody>',
    '      <tr ng-repeat="employee in $ctrl.employees track by employee.id">',
    '        <td style="padding: 0.75rem; border-top: 1px solid #e5e7eb;">{{ employee.name }}</td>',
    '        <td style="padding: 0.75rem; border-top: 1px solid #e5e7eb;">{{ employee.email }}</td>',
    '        <td style="padding: 0.75rem; border-top: 1px solid #e5e7eb;">{{ employee.department }}</td>',
    '        <td style="padding: 0.75rem; border-top: 1px solid #e5e7eb;">{{ employee.position }}</td>',
    '        <td style="padding: 0.75rem; border-top: 1px solid #e5e7eb;">',
    '          <button ng-click="$ctrl.editEmployee(employee)" style="margin-right: 0.5rem;">Edit</button>',
    '          <button ng-click="$ctrl.deleteEmployee(employee)">Delete</button>',
    '        </td>',
    '      </tr>',
    '    </tbody>',
    '  </table>',
    '</section>'
  ].join(''),
  controller: ['$http', function ($http) {
    var ctrl = this;

    ctrl.employees = [];
    ctrl.form = {};
    ctrl.isEditing = false;
    ctrl.message = '';
    ctrl.errorMessage = '';

    var csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      $http.defaults.headers.common['X-CSRF-Token'] = csrfToken.getAttribute('content');
    }

    function setMessage(message, error) {
      ctrl.message = error ? '' : message;
      ctrl.errorMessage = error ? message : '';
    }

    ctrl.loadEmployees = function () {
      $http.get('/employees.json').then(function (response) {
        ctrl.employees = response.data;
      });
    };

    ctrl.submitEmployee = function () {
      var payload = { employee: ctrl.form };
      var request = ctrl.isEditing
        ? $http.patch('/employees/' + ctrl.form.id + '.json', payload)
        : $http.post('/employees.json', payload);

      request.then(function () {
        ctrl.loadEmployees();
        ctrl.form = {};
        ctrl.isEditing = false;
        setMessage('Employee ' + (ctrl.isEditing ? 'updated' : 'created') + '.', false);
      }, function (response) {
        var errors = response.data && response.data.errors ? response.data.errors.join(', ') : 'Unable to save employee.';
        setMessage(errors, true);
      });
    };

    ctrl.editEmployee = function (employee) {
      ctrl.form = angular.copy(employee);
      ctrl.isEditing = true;
      setMessage('', false);
    };

    ctrl.cancelEdit = function () {
      ctrl.form = {};
      ctrl.isEditing = false;
      setMessage('', false);
    };

    ctrl.deleteEmployee = function (employee) {
      if (!window.confirm('Delete this employee?')) {
        return;
      }

      $http.delete('/employees/' + employee.id + '.json').then(function () {
        ctrl.loadEmployees();
        setMessage('Employee removed.', false);
      }, function () {
        setMessage('Unable to delete employee.', true);
      });
    };

    ctrl.loadEmployees();
  }]
});
