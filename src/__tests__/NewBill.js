/**
 * @jest-environment jsdom
 */

import {  screen, fireEvent } from "@testing-library/dom"
import { getByTestId, getByLabelText } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from '@testing-library/user-event'


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
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const store = null
      document.body.innerHTML =  NewBillUI()
      const testImageFile = new File(["hello"], "hello.png", { type: "image/png" });
      const newBill = new NewBill({ document, onNavigate, store, localStorage })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const fileInput = screen.getByTestId('file')
      fileInput.value = testImageFile
      expect(screen.getByTestId('file')).toBeTruthy()
      fireEvent.change(fileInput, {
        target: { value: '' },
      });
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})
