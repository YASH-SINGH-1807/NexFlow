import type {
  SourceConnectionType,
  SourceNodeConfig,
} from "../../types/nodeConfig";

interface SourceNodeConfigFormProps {
  value: SourceNodeConfig;

  onChange: (
    value: SourceNodeConfig
  ) => void;
}

export default function SourceNodeConfigForm({
  value,
  onChange,
}: SourceNodeConfigFormProps) {
  const updateField = <
    K extends keyof SourceNodeConfig,
  >(
    field: K,
    fieldValue: SourceNodeConfig[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleConnectionTypeChange = (
    connectionType: SourceConnectionType
  ) => {
    onChange({
      connectionType,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="source-connection-type"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Connection Type
        </label>

        <select
          id="source-connection-type"
          value={value.connectionType}
          onChange={(event) =>
            handleConnectionTypeChange(
              event.target
                .value as SourceConnectionType
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

      {(value.connectionType ===
        "postgresql" ||
        value.connectionType ===
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
            label="Username"
            value={value.username ?? ""}
            onChange={(username) =>
              updateField(
                "username",
                username
              )
            }
          />
        </>
      )}

      {value.connectionType === "csv" && (
        <TextField
          label="File Path"
          value={value.filePath ?? ""}
          onChange={(filePath) =>
            updateField(
              "filePath",
              filePath
            )
          }
        />
      )}

      {value.connectionType ===
        "rest-api" && (
        <>
          <TextField
            label="API URL"
            value={value.url ?? ""}
            onChange={(url) =>
              updateField("url", url)
            }
          />

          <div>
            <label
              htmlFor="source-http-method"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              HTTP Method
            </label>

            <select
              id="source-http-method"
              value={value.method ?? "GET"}
              onChange={(event) =>
                updateField(
                  "method",
                  event.target.value as
                    | "GET"
                    | "POST"
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
                outline-none
              "
            >
              <option value="GET">
                GET
              </option>

              <option value="POST">
                POST
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
  onChange: (value: string) => void;
}

function TextField({
  label,
  value,
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