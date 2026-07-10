import type {
  DestinationNodeConfig,
  DestinationType,
} from "../../types/nodeConfig";

interface DestinationNodeConfigFormProps {
  value: DestinationNodeConfig;

  onChange: (
    value: DestinationNodeConfig
  ) => void;
}

export default function DestinationNodeConfigForm({
  value,
  onChange,
}: DestinationNodeConfigFormProps) {
  const updateField = <
    K extends keyof DestinationNodeConfig,
  >(
    field: K,
    fieldValue: DestinationNodeConfig[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleDestinationTypeChange = (
    destinationType: DestinationType
  ) => {
    onChange({
      destinationType,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="destination-type"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Destination Type
        </label>

        <select
          id="destination-type"
          value={value.destinationType}
          onChange={(event) =>
            handleDestinationTypeChange(
              event.target
                .value as DestinationType
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-sm
            text-slate-900
            outline-none
            transition
            focus:border-blue-400
            focus:ring-4
            focus:ring-blue-50
          "
        >
          <option value="postgresql">
            PostgreSQL
          </option>

          <option value="mysql">
            MySQL
          </option>

          <option value="csv">
            CSV File
          </option>

          <option value="rest-api">
            REST API
          </option>
        </select>
      </div>

      {(value.destinationType ===
        "postgresql" ||
        value.destinationType ===
          "mysql") && (
        <>
          <TextField
            label="Host"
            value={value.host ?? ""}
            onChange={(host) =>
              updateField("host", host)
            }
          />

          <NumberField
            label="Port"
            value={value.port}
            onChange={(port) =>
              updateField("port", port)
            }
          />

          <TextField
            label="Database"
            value={value.database ?? ""}
            onChange={(database) =>
              updateField(
                "database",
                database
              )
            }
          />

          <TextField
            label="Table"
            value={value.table ?? ""}
            onChange={(table) =>
              updateField("table", table)
            }
          />
        </>
      )}

      {value.destinationType === "csv" && (
        <TextField
          label="Output File Path"
          value={value.filePath ?? ""}
          placeholder="Example: ./output/results.csv"
          onChange={(filePath) =>
            updateField(
              "filePath",
              filePath
            )
          }
        />
      )}

      {value.destinationType ===
        "rest-api" && (
        <>
          <TextField
            label="API URL"
            value={value.url ?? ""}
            placeholder="Example: https://api.example.com/data"
            onChange={(url) =>
              updateField("url", url)
            }
          />

          <div>
            <label
              htmlFor="destination-http-method"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              HTTP Method
            </label>

            <select
              id="destination-http-method"
              value={value.method ?? "POST"}
              onChange={(event) =>
                updateField(
                  "method",
                  event.target.value as
                    | "POST"
                    | "PUT"
                    | "PATCH"
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-50
              "
            >
              <option value="POST">
                POST
              </option>

              <option value="PUT">
                PUT
              </option>

              <option value="PATCH">
                PATCH
              </option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          px-3
          py-2.5
          text-sm
          text-slate-900
          outline-none
          transition
          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-50
        "
      />
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value?: number;

  onChange: (
    value: number | undefined
  ) => void;
}

function NumberField({
  label,
  value,
  onChange,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="number"
        value={value ?? ""}
        onChange={(event) => {
          const rawValue =
            event.target.value;

          onChange(
            rawValue === ""
              ? undefined
              : Number(rawValue)
          );
        }}
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          px-3
          py-2.5
          text-sm
          text-slate-900
          outline-none
          transition
          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-50
        "
      />
    </label>
  );
}