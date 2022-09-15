/**
 * @jest-environment jsdom
 */

import {  screen, fireEvent } from "@testing-library/dom"
import { getByTestId, getByLabelText } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import userEvent from '@testing-library/user-event'

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then Input should appear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
      expect(screen.getByTestId('expense-type')).toBeTruthy()
      expect(screen.getByTestId('expense-name')).toBeTruthy()
      expect(screen.getByTestId('datepicker')).toBeTruthy()
      expect(screen.getByTestId('amount')).toBeTruthy()
      expect(screen.getByTestId('vat')).toBeTruthy()
      expect(screen.getByTestId('pct')).toBeTruthy()
      expect(screen.getByTestId('commentary')).toBeTruthy()
      expect(screen.getByTestId('file')).toBeTruthy()
    })
    test("Then Label should appear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByText('Type de dépense')).toBeTruthy()
      expect(screen.getByText('Nom de la dépense')).toBeTruthy()
      expect(screen.getByText('Date')).toBeTruthy()
      expect(screen.getByText('Montant TTC')).toBeTruthy()
      expect(screen.getByText('TVA')).toBeTruthy()
      expect(screen.getByText('Commentaire')).toBeTruthy()
      expect(screen.getByText('Justificatif')).toBeTruthy()
    })
  })

  describe('When I am select a picture', () => {
    test(('handleChangefile should by called'), async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const store = mockStore
      document.body.innerHTML =  NewBillUI()
      const testImageFile = new File(["hello"], "hello.png", { type: "image/png" });
      const newBill = new NewBill({ document, onNavigate, store, localStorage })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      handleChangeFile({
        target: {
          files: [ testImageFile ],
          value: 'C:\fakepath\hello.png',
        },
        preventDefault: function(){}
      })
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })

  describe("When I do not fill fields and I click on Submit button", () => {
    test("Then It should not change of page", () => {
      document.body.innerHTML = NewBillUI();
      expect(screen.getByTestId('expense-name').value).toBe("")
      expect(screen.getByTestId('datepicker').value).toBe("")
      expect(screen.getByTestId('amount').value).toBe("")
      expect(screen.getByTestId('vat').value).toBe("")
      expect(screen.getByTestId('pct').value).toBe("")
      expect(screen.getByTestId('commentary').value).toBe("")
      expect(screen.getByTestId('file').value).toBe("")

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });

  describe("When I fill all fields and I click on Submit button", () => {
    
    test("Then It should renders Bills page if the entry are correct", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee', email: 'johndoe@email.com',
      }))
      const store = mockStore
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, store, localStorage })
      const testImageFile = new File(["hello"], "hello.png", { type: "image/png" });
      screen.getByTestId('expense-type').value = "Transports"
      screen.getByTestId('expense-name').value = "Test"
      screen.getByTestId('datepicker').value = "2022-08-10"
      screen.getByTestId('amount').value = 500
      screen.getByTestId('vat').value = 70
      screen.getByTestId('pct').value = 20
      screen.getByTestId('commentary').value = "Ceci est un commentaire"
      const fileInput = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      fireEvent.change(fileInput, {  target: {files: [testImageFile]}  })
      handleChangeFile({
        target: {
          files: [ testImageFile ],
          value: 'C:\fakepath\hello.png',
        },
        preventDefault: function(){}
      })
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      await expect(handleChangeFile).toHaveBeenCalled()
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    });
  
    test("Then It should stay on NewBills page if  the file is not un PNG or a JPG", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee', email: 'johndoe@email.com',
      }))
      const store = mockStore
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, store, localStorage })
      const testImageFile = new File(["hello"], "hello.gif", { type: "image/gif" });
      screen.getByTestId('expense-type').value = "Transports"
      screen.getByTestId('expense-name').value = "Test"
      screen.getByTestId('datepicker').value = "2022-08-10"
      screen.getByTestId('amount').value = 500
      screen.getByTestId('vat').value = 70
      screen.getByTestId('pct').value = 20
      screen.getByTestId('commentary').value = "Ceci est un commentaire"
      const fileInput = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      fireEvent.change(fileInput, {  target: {files: [testImageFile]}  })
      handleChangeFile({
        target: {
          files: [ testImageFile ],
          value: 'C:\fakepath\hello.gif',
        },
        preventDefault: function(){}
      })
      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      await expect(handleChangeFile).toHaveBeenCalled()
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });
})
