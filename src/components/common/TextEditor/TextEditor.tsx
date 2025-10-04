import { useEffect, useRef } from 'react';
import Quill from 'quill';
import type { QuillOptions, Range } from 'quill';
import clsx from 'clsx';
import 'quill/dist/quill.snow.css';
import './TextEditor.css';
import caretDown from '@/assets/caret-down.svg';

type TextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  modules?: QuillOptions['modules'];
  formats?: QuillOptions['formats'];
  theme?: QuillOptions['theme'];
};

const FONT_WHITELIST = ['fustat', 'roboto'] as const;
const DEFAULT_PLACEHOLDER = 'Description about university';

const DEFAULT_MODULES: NonNullable<QuillOptions['modules']> = {
  toolbar: [
    [{ font: FONT_WHITELIST }],
    [{ size: ['small', false, 'large'] }],
    ['bold', 'italic', 'underline'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }],
    [{ list: 'bullet' }, { list: 'ordered' }],
  ],
};

const DEFAULT_FORMATS = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'list',
  'align',
];

const EMPTY_HTML = '<p><br></p>';

const extractHTML = (instance: Quill) => {
  const html = instance.root.innerHTML;
  return html === EMPTY_HTML ? '' : html;
};

let formatsRegistered = false;
const ensureFormatsRegistered = () => {
  if (formatsRegistered) {
    return;
  }

  const Font = Quill.import('formats/font') as { whitelist: string[] };
  Font.whitelist = [...FONT_WHITELIST];
  Quill.register('formats/font', Font, true);
  formatsRegistered = true;
};

export const TextEditor = ({
  value = '',
  onChange,
  onFocus,
  onBlur,
  readOnly = false,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  modules,
  formats,
  theme = 'snow',
}: TextEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onFocusRef = useRef(onFocus);
  const onBlurRef = useRef(onBlur);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onFocusRef.current = onFocus;
  }, [onFocus]);

  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  useEffect(() => {
    initialValueRef.current = value;
  }, [value]);

  useEffect(() => {
    ensureFormatsRegistered();

    const mountNode = containerRef.current;
    if (!mountNode) {
      return;
    }

    mountNode.innerHTML = '';

    const editorElement = document.createElement('div');
    mountNode.append(editorElement);

    const quill = new Quill(editorElement, {
      theme,
      readOnly,
      placeholder,
      modules: modules ?? DEFAULT_MODULES,
      formats: formats ?? DEFAULT_FORMATS,
    });

    quillRef.current = quill;

    const prependFontLabel = () => {
      const fontPicker = mountNode.querySelector(
        '.ql-toolbar .ql-formats .ql-picker.ql-font'
      );
      if (!fontPicker) {
        return;
      }

      const parent = fontPicker.parentElement;
      if (!parent || parent.querySelector('.text-editor__font-label')) {
        return;
      }

      const label = document.createElement('div');
      label.className = 'text-editor__font-label';
      label.textContent = 'T';

      parent.prepend(label);
    };

    prependFontLabel();

    const appendCaretIcon = (selector: string) => {
      const labels = mountNode.querySelectorAll(selector);
      labels.forEach((label) => {
        if (label.querySelector('.text-editor__caret-icon')) {
          return;
        }

        const icon = document.createElement('img');
        icon.src = caretDown;
        icon.alt = 'caret down';
        icon.className = 'text-editor__caret-icon';
        label.append(icon);
      });
    };

    appendCaretIcon('.ql-picker.ql-font .ql-picker-label');
    appendCaretIcon('.ql-picker.ql-size .ql-picker-label');

    const initialValue = initialValueRef.current ?? '';

    if (initialValue) {
      quill.setContents(quill.clipboard.convert({ html: initialValue }), 'silent');
    } else {
      quill.setText('', 'silent');
    }

    const handleTextChange = () => {
      const handler = onChangeRef.current;
      if (!handler) {
        return;
      }

      handler(extractHTML(quill));
    };

    const handleSelectionChange = (range: Range | null, oldRange: Range | null) => {
      if (range && !oldRange) {
        onFocusRef.current?.();
      }

      if (!range && oldRange) {
        onBlurRef.current?.();
      }
    };

    quill.on('text-change', handleTextChange);
    quill.on('selection-change', handleSelectionChange);

    return () => {
      quill.off('text-change', handleTextChange);
      quill.off('selection-change', handleSelectionChange);
      quillRef.current = null;
      mountNode.innerHTML = '';
    };
  }, [formats, modules, placeholder, readOnly, theme]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    const normalizedValue = value ?? '';
    if (normalizedValue === extractHTML(quill)) {
      return;
    }

    if (normalizedValue) {
      quill.setContents(quill.clipboard.convert({ html: normalizedValue }), 'silent');
    } else {
      quill.setText('', 'silent');
    }
  }, [value]);

  return (
    <div className={clsx('text-editor', className)}>
      <div ref={containerRef} />
    </div>
  );
};
