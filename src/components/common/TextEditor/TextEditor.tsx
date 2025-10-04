import { useEffect, useRef } from 'react';
import Quill from 'quill';
import type { QuillOptions, Range } from 'quill';
import clsx from 'clsx';
import 'quill/dist/quill.snow.css';
import './TextEditor.css';

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

const FONT_WHITELIST = ['fustat', 'inter', 'serif', 'monospace'] as const;
const DEFAULT_PLACEHOLDER = 'Add Bachelor Program List , example :';

const DEFAULT_MODULES: NonNullable<QuillOptions['modules']> = {
  toolbar: [
    [{ header: [false, 1, 2, 3] }],
    [{ font: FONT_WHITELIST }],
    [{ size: ['small', false, 'large'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }],
    [{ list: 'bullet' }, { list: 'ordered' }],
    [{ color: [] }],
  ],
};

const DEFAULT_FORMATS = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'align',
  'color',
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
