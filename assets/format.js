/**
 * Simple Pull Quote Format Registration
 * Direct approach without domReady
 */

// Function to attempt registration
function attemptRegistration() {
    // Check if required WordPress APIs are available
    if (!window.wp || !window.wp.richText || !window.wp.blockEditor || !window.wp.element) {
        setTimeout(attemptRegistration, 500);
        return;
    }

    const { registerFormatType, toggleFormat, applyFormat, removeFormat } = window.wp.richText;
    const { RichTextToolbarButton, RichTextShortcut } = window.wp.blockEditor;
    const { createElement, Fragment } = window.wp.element;
    
    // Simple fallback for translation
    const __ = window.wp.i18n && window.wp.i18n.__ ? window.wp.i18n.__ : function(text) { return text; };

    // Use a proper WordPress icon
    const icon = window.wp.icons && window.wp.icons.pullquote ? 
        window.wp.icons.pullquote : 
        // Fallback to quote icon or create a simple SVG
        (window.wp.icons && window.wp.icons.quote ? 
            window.wp.icons.quote :
            createElement('svg', {
                width: 20,
                height: 20,
                viewBox: '0 0 24 24',
                xmlns: 'http://www.w3.org/2000/svg'
            }, 
                createElement('path', {
                    d: 'M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z'
                })
            )
        );

    const PULL_QUOTE_FORMAT = {
        name: 'tm/pull-quote',
        title: __('Pull Quote'),
        tagName: 'pull-quote',
        className: null,
        attributes: {
            right: 'right',
            center: 'center'
        }
    };

    function PullQuoteButton(props) {
        const { value, onChange } = props;
        
        function getCurrentAlignment() {
            if (!value || !value.formats) return null;
            
            const { start, end } = value;
            if (start === undefined || end === undefined) return null;
            
            for (let i = start; i < end; i++) {
                const formats = value.formats[i];
                if (formats) {
                    for (let j = 0; j < formats.length; j++) {
                        const format = formats[j];
                        if (format && format.type === PULL_QUOTE_FORMAT.name) {
                            if (format.attributes?.center !== undefined) return 'center';
                            if (format.attributes?.right !== undefined) return 'right';
                            return 'left';
                        }
                    }
                }
            }
            return null;
        }
        
        function isActive() {
            return getCurrentAlignment() !== null;
        }

        function handleClick() {
            const currentAlign = getCurrentAlignment();
            
            if (currentAlign === null) {
                // Not currently formatted, apply left alignment
                applyPullQuote('left');
            } else if (currentAlign === 'left') {
                // Currently left, switch to right
                applyPullQuote('right');
            } else if (currentAlign === 'right') {
                // Currently right, switch to center
                applyPullQuote('center');
            } else {
                // Currently center, remove formatting
                removePullQuote();
            }
        }

        function applyPullQuote(alignment = 'left') {
            // Remove any existing pull quote format first
            let newValue = removeFormat(value, PULL_QUOTE_FORMAT.name);
            
            // Apply new format with alignment
            const formatToApply = {
                type: PULL_QUOTE_FORMAT.name
            };
            
            if (alignment === 'right') {
                formatToApply.attributes = { right: '' };
            } else if (alignment === 'center') {
                formatToApply.attributes = { center: '' };
            }
            
            newValue = applyFormat(newValue, formatToApply);
            onChange(newValue);
        }

        function removePullQuote() {
            const newValue = removeFormat(value, PULL_QUOTE_FORMAT.name);
            onChange(newValue);
        }

        const currentAlign = getCurrentAlignment();
        
        // Create dynamic title based on current state
        let buttonTitle = __('Pull Quote');
        if (currentAlign) {
            if (currentAlign === 'left') {
                buttonTitle = __('Pull Quote (Left → Right)');
            } else if (currentAlign === 'right') {
                buttonTitle = __('Pull Quote (Right → Center)');
            } else if (currentAlign === 'center') {
                buttonTitle = __('Pull Quote (Center → Remove)');
            }
        }

        return createElement(RichTextToolbarButton, {
            icon: icon,
            title: buttonTitle,
            onClick: handleClick,
            isActive: isActive(),
            shortcutType: 'primary',
            shortcutCharacter: 'q'
        });
    }

    try {
        registerFormatType(PULL_QUOTE_FORMAT.name, {
            title: PULL_QUOTE_FORMAT.title,
            tagName: PULL_QUOTE_FORMAT.tagName,
            className: PULL_QUOTE_FORMAT.className,
            edit: PullQuoteButton,
        });
    } catch (error) {
        // Silent fail - format registration unsuccessful
    }
}

// Start attempting registration immediately
attemptRegistration();
