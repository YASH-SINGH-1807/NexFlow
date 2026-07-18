import type {
  TransformNodeConfig,
  TransformOperation,
} from "../../types/nodeConfig";

interface TransformNodeConfigFormProps {
  value: TransformNodeConfig;

  onChange: (
    value: TransformNodeConfig
  ) => void;
}

export default function TransformNodeConfigForm({
  value,
  onChange,
}: TransformNodeConfigFormProps) {
  const updateField = <
    K extends keyof TransformNodeConfig,
  >(
    field: K,
    fieldValue: TransformNodeConfig[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleOperationChange = (
  operation: TransformOperation
) => {
  if (operation === "aggregate") {
    onChange({
      ...value,
      operation,
      aggregateFunction:
        value.aggregateFunction ?? "count",
    });

    return;
  }

  onChange({
    ...value,
    operation,
  });
};
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="transform-operation"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Operation
        </label>

        <select
          id="transform-operation"
          value={value.operation}
          onChange={(event) =>
            handleOperationChange(
              event.target
                .value as TransformOperation
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
          <option value="filter">
            Filter
          </option>

          <option value="map">
            Map
          </option>

          <option value="aggregate">
            Aggregate
          </option>

          <option value="sort">
            Sort
          </option>
        </select>
      </div>

      {value.operation === "filter" && (
        <TextAreaField
          label="Filter Expression"
          value={value.expression ?? ""}
          placeholder="Example: age >= 18"
          onChange={(expression) =>
            updateField(
              "expression",
              expression
            )
          }
        />
      )}

      {value.operation === "map" && (
        <TextAreaField
          label="Mapping Expression"
          value={value.expression ?? ""}
          placeholder="Example: fullName = firstName + ' ' + lastName"
          onChange={(expression) =>
            updateField(
              "expression",
              expression
            )
          }
        />
      )}

      {value.operation === "aggregate" && (
  <>
    <TextField
      label="Group By Fields"
      value={
        value.groupBy?.join(", ") ?? ""
      }
      placeholder="Example: country"
     onChange={(rawValue) => {

  const groupBy = rawValue
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  updateField(
    "groupBy",
    groupBy
  );
}}
/>

    <TextField
      label="Aggregate Field"
      value={
        value.aggregateField ?? ""
      }
      placeholder="Example: salary"
      onChange={(value) =>
        updateField(
          "aggregateField",
          value
        )
      }
    />

    <div>
      <label
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Aggregate Function
      </label>

      <select
        value={
          value.aggregateFunction ??
          "count"
        }
        onChange={(event) =>
          updateField(
            "aggregateFunction",
            event.target.value as
              | "count"
              | "sum"
              | "avg"
              | "min"
              | "max"
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
        <option value="count">
          Count
        </option>

        <option value="sum">
          Sum
        </option>

        <option value="avg">
          Average
        </option>

        <option value="min">
          Minimum
        </option>

        <option value="max">
          Maximum
        </option>
      </select>
    </div>
  </>
)}

      {value.operation === "sort" && (
        <>
          <TextField
            label="Sort Field"
            value={
              value.sortField ?? ""
            }
            placeholder="Example: createdAt"
            onChange={(sortField) =>
              updateField(
                "sortField",
                sortField
              )
            }
          />

          <div>
            <label
              htmlFor="sort-direction"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Sort Direction
            </label>

            <select
              id="sort-direction"
              value={
                value.sortDirection ??
                "asc"
              }
              onChange={(event) =>
                updateField(
                  "sortDirection",
                  event.target.value as
                    | "asc"
                    | "desc"
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
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
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

interface TextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        rows={5}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          resize-y
          rounded-xl
          border
          border-slate-200
          px-3
          py-2.5
          font-mono
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