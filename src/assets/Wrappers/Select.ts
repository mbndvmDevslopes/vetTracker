import styled from 'styled-components';

export const Wrapper = styled.section`
  .container {
    position: relative;
    width: 20em;
    min-height: 1.5em;
    border: 0.05em solid #777;
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em;
    border-radius: 0.25em;
    outline: none;
  }

  .container:focus {
    border-color: hsl(200, 100%, 50%);
  }

  .value {
    flex-grow: 1;
    display: flex;
    gap: 0.5em;
    flex-wrap: wrap;
  }

  .clear-btn {
    background: none;
    color: #777;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 1.25em;
  }

  .clear-btn:focus,
  .clear-btn:hover {
    color: #333;
  }

  .divider {
    background-color: #777;
    align-self: stretch;
    width: 0.05em;
  }

  .caret {
    translate: 0 25%;
    border: 0.25em solid transparent;
    border-top-color: #777;
  }

  .options {
    position: absolute;
    margin: 0;
    padding: 0;
    list-style: none;
    display: none;
    max-height: 15em;
    overflow-y: auto;
    border: 0.05em solid #777;
    border-radius: 0.25em;
    width: 100%;
    left: 0;
    top: calc(100% + 0.25em);
    background-color: white;
    z-index: 100;
  }

  .options.show {
    display: block;
  }

  .option {
    padding: 0.25em 0.5em;
    cursor: pointer;
  }

  .option.selected {
    background-color: hsl(200, 100%, 70%);
  }

  .option.highlighted {
    background-color: hsl(200, 100%, 50%);
    color: white;
  }

  .option-badge {
    display: flex;
    align-items: center;
    border: 0.05em solid #777;
    border-radius: 0.25em;
    padding: 0.15em 0.25em;
    gap: 0.25em;
    cursor: pointer;
    background: none;
    outline: none;
  }

  .option-badge:hover,
  .option-badge:focus {
    background-color: hsl(0, 100%, 90%);
    border-color: hsl(0, 100%, 50%);
  }

  .option-badge:hover > .remove-btn,
  .option-badge:focus > .remove-btn {
    color: hsl(0, 100%, 50%);
  }

  .option-badge > .remove-btn {
    font-size: 1.25em;
    color: #777;
  }
`;
