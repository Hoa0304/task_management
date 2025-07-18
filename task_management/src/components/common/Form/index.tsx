"use client";

import { useState, useEffect } from "react";
import { FormProps, User } from "@/lib/types";
import ImageUploader from "../Image";

interface ExtendedFormProps extends FormProps {
  users?: User[];
}

export default function ReusableForm({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  showButtons = true,
  users = [],
}: ExtendedFormProps) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;

  if (multiple) {
    const values = Array.from(selectedOptions, (option) => option.value);

    if (name === "members") {
      const selectedMembers = users
        .filter((user) => values.includes(user.id.toString()))
        .map((user) => ({ name: user.name || "", avatar: user.avatar || "" }));

      setForm((prev) => ({ ...prev, [name]: selectedMembers }));
    } else {
      setForm((prev) => ({ ...prev, [name]: values }));
    }
  } else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-transparent p-6">
      {fields.map((field) => (
        <div key={String(field.name)}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}
          </label>

          {field.type === "members" ? (
            <select
  multiple
  name={String(field.name)}
  value={
    (form[String(field.name)] || []).map((member: any) =>
      users.find((u) => u.name === member.name)?.id.toString()
    )
  }
  onChange={handleChange}
  className="w-full px-3 py-2 border border-[#E5E5ED] rounded-md"
>
  {users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))}
</select>

          ) : field.type === "avatar" ? (
            <ImageUploader
              initialValue={form[String(field.name)]}
              onImageUpload={(base64) =>
                setForm((prev) => ({ ...prev, [field.name]: base64 }))
              }
            />
          ) : field.type === "textarea" ? (
            <textarea
              name={String(field.name)}
              value={form[String(field.name)] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-[#E5E5ED] rounded-md"
              rows={3}
            />
          ) : field.type === "select" ? (
            <select
              name={String(field.name)}
              value={form[String(field.name)] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#E5E5ED] rounded-md"
            >
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <div className="relative">
              {field.icon && (
                <div className="absolute left-3 top-2.5 text-gray-400">
                  {field.icon}
                </div>
              )}
              <input
                type={field.type}
                name={String(field.name)}
                value={form[String(field.name)] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`w-full ${
                  field.icon ? "pl-9" : ""
                } px-3 py-2 border border-[#E5E5ED] rounded-md`}
              />
            </div>
          )}
        </div>
      ))}

      {showButtons && (
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-1.5 rounded-md hover:bg-indigo-700 text-sm"
          >
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}
