export interface FieldConfig {
  label: string;
  key: string;
  type?: "text" | "number" | "textarea" | "date" | "select" | "checkbox" | "email" | "password" | "url";
  readOnly?: boolean;                  // field is readonly in form
  required?: boolean;                  // field is required in form
  options?: { label: string; value: any }[]; // for select/radio
  showOn?: "view" | "create" | "both" | "all";  // control visibility
  tabIndex?: number;                   // custom tab order
  pointerEventsNone?: boolean;         // disable pointer events
  placeholder?: string;
  defaultValue?: any;                  // default value if data is null
  maxLength?: number;                  // limit text input length
  minLength?: number;                  // minimum text length
  pattern?: string;                    // regex validation
  validate?: (value: any) => string | null; // custom validation function
  tooltip?: string;                     // optional tooltip/help text
  className?: string;                   // extra CSS class
  hidden?: boolean;                     // completely hide field
  prefix?: string;                      // prefix in input box
  suffix?: string;                      // suffix in input box
  step?: number;                        // for number/date input
  min?: number | string;                // min value/date
  max?: number | string;                // max value/date
  readOnlyInView?: boolean;             // readonly in view mode
}
