const fs = require('fs')
const path = require('path')

const STORE_PATH = path.join(__dirname, '../printers.json')

// ---------- load ----------
function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = {
      activePrinter: 'Default Printer',
      printers: {
        'Default Printer': {
          prices: { PLA: 40, PETG: 60, ABS: 55 },
          power: 120,
          tariff: 0.15,
          amort: 0.5,
          markup: 3
        }
      }
    }

    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2))
    return initial
  }

  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'))
}

// ---------- save ----------
function saveStore(store) {
  console.log('STORE PATH =', STORE_PATH)
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
  console.log('STORE WRITTEN')
}

// ---------- printers ----------
function savePrinter(name, settings) {
  const store = loadStore()
  store.printers[name] = JSON.parse(JSON.stringify(settings))
  store.activePrinter = name
  saveStore(store)
}

function setActivePrinter(name) {
  const store = loadStore()
  if (!store.printers[name]) return false
  store.activePrinter = name
  saveStore(store)
  return true
}

function deletePrinter(name) {
  const store = loadStore()

  if (name === 'Default Printer' && Object.keys(store.printers).length === 1) {
    return false
  }

  delete store.printers[name]

  if (store.activePrinter === name) {
    store.activePrinter = 'Default Printer'
  }

  saveStore(store)
  return true
}

function renamePrinter(oldName, newName) {
  const store = loadStore()

  if (!store.printers[oldName]) return false
  if (store.printers[newName]) return false

  store.printers[newName] = store.printers[oldName]
  delete store.printers[oldName]

  if (store.activePrinter === oldName) {
    store.activePrinter = newName
  }

  saveStore(store)
  return true
}

function getPrintersList() {
  const store = loadStore()
  return Object.keys(store.printers)
}

// ---------- exports ----------
module.exports = {
  loadStore,
  saveStore,
  savePrinter,
  setActivePrinter,
  deletePrinter,
  renamePrinter,
  getPrintersList
}
