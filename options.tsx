import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoAddCircle, IoSave, IoTrash } from "react-icons/io5";

import { Storage } from "@plasmohq/storage";

import "./style.css";

// Default rows to initialize on first run
const defaultRows = [
  // personal information
  { key: "jean", value: "__FIRST_NAME__" },
  { key: "bolt", value: "__LAST_NAME__" },
  { key: "1990-01-01", value: "__DATE_OF_BIRTH__" },
  { key: "+33.6.77.88.99.00", value: "__PHONE__" },
  { key: "jean.bolt@example.com", value: "__EMAIL__" },
  { key: "secretP4ssw0rd", value: "__PASSWORD__" },
  { key: "5 avenue de rome", value: "__ADDRESS__" },
  { key: "192.168.1.1", value: "__IP_ADDRESS__" },

  // government IDs
  { key: "DA1234567", value: "__PASSPORT_NUMBER__" },
  { key: "B6328174", value: "__DRIVER_LICENSE_NUMBER__" }
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, when: "beforeChildren" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 10 }
};

const fadeVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const storage = new Storage();

const DynamicForm = () => {
  // Initialize with defaultRows, will be overridden if saved data exists
  const [rows, setRows] = useState(defaultRows);
  const [valueOptions, setValueOptions] = useState<string[]>(defaultRows.map((r) => r.value));
  const [saveMessage, setSaveMessage] = useState("");

  // Helper function to format the value
  const formatValue = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === "") {
      return "";
    }

    const withoutUnderscores = trimmed.replace(/^_+|_+$/g, "");
    return `__${withoutUnderscores.toUpperCase()}__`;
  };

  // Load saved form data on component mount and compute valueOptions
  useEffect(() => {
    (async () => {
      const savedFormData = await storage.get("personalData");
      if (savedFormData) {
        const loadedRows: { key: string; value: string }[] = JSON.parse(savedFormData);
        setRows(loadedRows);
        setValueOptions([...new Set(loadedRows.map((row: any) => row.value).filter((value: string) => value !== ""))]);
      }
    })();
  }, []);

  // Handle changes in any input field
  const handleInputChange = (index: number, field: "key" | "value", value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // add a new row
  const addRow = () => {
    setRows([...rows, { key: "", value: "" }]);
  };

  //  delete an existing row; ensures at least one row remains
  const deleteRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  // save the current form data and update valueOptions
  const saveForm = async () => {
    // format all values before saving
    const formattedRows = rows.map((row) => ({
      key: row.key,
      value: formatValue(row.value)
    }));
    setRows(formattedRows);

    // update valueOptions to unique values from current rows
    setValueOptions([...new Set(formattedRows.map((row) => row.value).filter((value) => value !== ""))]);

    await storage.set("personalData", JSON.stringify(formattedRows));
    await storage.set("onboarded", JSON.stringify(defaultRows) !== JSON.stringify(formattedRows));

    // show save message briefly
    setSaveMessage(chrome.i18n.getMessage("form_saved_successfully"));
    setTimeout(() => setSaveMessage(""), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container mx-auto max-w-4xl p-6 text-base">
      {/* description */}
      <section className="mb-3 text-sm leading-relaxed text-gray-700">
        <h2 className="text-2xl font-extrabold mb-3">🔒 {chrome.i18n.getMessage("secure_your_prompts_title")}</h2>

        <p className="mb-3">
          {chrome.i18n.getMessage("swaps_1")} <b>{chrome.i18n.getMessage("real_world_data")}</b> {chrome.i18n.getMessage("swaps_2")}{" "}
          <b className="text-indigo-600">{chrome.i18n.getMessage("placeholders")}</b> <em>{chrome.i18n.getMessage("before_anything_leaves")}</em> ✨
        </p>

        <p className="mb-3">
          1️⃣ <b>{chrome.i18n.getMessage("replace_examples_with_info")}</b>
          <br />
          2️⃣ {chrome.i18n.getMessage("need_more_slots")} <b>{chrome.i18n.getMessage("add_row")}</b> <IoAddCircle className="inline align-text-bottom" />.<br />
          3️⃣ {chrome.i18n.getMessage("press_save_and_relax_1")} <b>{chrome.i18n.getMessage("save")}</b> {chrome.i18n.getMessage("press_save_and_relax_2")}{" "}
          <b>{chrome.i18n.getMessage("local")}</b>
        </p>

        <p className="italic text-gray-600">{chrome.i18n.getMessage("disclaimer")}</p>
      </section>

      {/* form  */}
      <section>
        <datalist id="valueOptions">
          {valueOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>

        {/* Use containerVariants on the table with stagger for each row */}
        <motion.table className="w-full table-auto shadow-md rounded-xl overflow-hidden" variants={containerVariants} initial="hidden" animate="visible">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-2/5 px-4 py-2 text-left text-xs font-bold text-gray-700 border-b">{chrome.i18n.getMessage("key")}</th>
              <th className="w-2/5 px-4 py-2 text-left text-xs font-bold text-gray-700 border-b">{chrome.i18n.getMessage("value")}</th>
              <th className="w-1/5 px-4 py-2 text-center text-xs font-bold text-gray-700 border-b">{chrome.i18n.getMessage("action")}</th>
            </tr>
          </thead>

          <motion.tbody>
            <AnimatePresence initial={false}>
              {rows.map((row, index) => (
                <motion.tr key={index} variants={itemVariants} exit="exit" className="even:bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.key}
                      placeholder={chrome.i18n.getMessage("key_in_lower_case")}
                      onChange={(e) => handleInputChange(index, "key", e.target.value)}
                      className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 transition-all duration-200"
                    />
                  </td>

                  <td className="border p-2">
                    <Autocomplete
                      freeSolo
                      options={valueOptions}
                      value={row.value} // selected value
                      filterOptions={(options) => options} // show all options
                      inputValue={row.value}
                      onInputChange={(_event, newInputValue) => handleInputChange(index, "value", newInputValue)}
                      onChange={(_event, newValue) => handleInputChange(index, "value", newValue || "")}
                      forcePopupIcon={true}
                      popupIcon={<ExpandCircleDownIcon />}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: ".5rem" } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={chrome.i18n.getMessage("value_without_underscores")}
                          onBlur={(e) => handleInputChange(index, "value", formatValue(e.target.value))}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <div className="flex gap-2 justify-center">
                      <Button variant="contained" color="success" onClick={addRow} className="min-w-[36px] min-h-[36px]">
                        <IoAddCircle size={20} />
                      </Button>
                      <Button variant="contained" color="error" onClick={() => deleteRow(index)} disabled={rows.length === 1} className="min-w-[36px] min-h-[36px]">
                        <IoTrash size={20} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </motion.table>

        <div className="flex items-center gap-4 mt-3">
          {/* Save button with a slight hover/tap animation */}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            variant="contained"
            color="primary"
            onClick={saveForm}
            startIcon={<IoSave />}
            className="shadow-md rounded-lg">
            {chrome.i18n.getMessage("save")}
          </Button>

          {/* "Form saved successfully" message with fade in/out */}
          <AnimatePresence>
            {saveMessage && (
              <motion.span
                className="px-4 py-2 rounded-lg shadow-sm text-xs text-green-700 bg-green-100 border border-green-200"
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5 }}>
                {saveMessage}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
};

export default DynamicForm;
