import React, { useState, useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Button } from '../../../mastodon/components/button';
import TextInput from '../../../mastodon/components/TextInput';
import { connect } from 'react-redux';
import { fetchApiKeys, createApiKey, updateApiKey, deleteApiKey } from '../../../mastodon/actions/server';

const messages = defineMessages({
  labelServiceName: { id: 'api_key_form.label_service_name', defaultMessage: 'Service Name' },
  placeholderServiceName: { id: 'api_key_form.placeholder_service_name', defaultMessage: 'Enter service name' },
  labelPrivateKey: { id: 'api_key_form.label_private_key', defaultMessage: 'Private Key' },
  placeholderPrivateKey: { id: 'api_key_form.placeholder_private_key', defaultMessage: 'Enter private key' },
  submit: { id: 'api_key_form.submit', defaultMessage: 'Save' },
  update: { id: 'api_key_form.update', defaultMessage: 'Update API Key' },
  cancel: { id: 'api_key_form.cancel', defaultMessage: 'Cancel' },
  edit: { id: 'api_key_form.edit', defaultMessage: 'Edit' },
  delete: { id: 'api_key_form.delete', defaultMessage: 'Delete' },
  noKeys: { id: 'api_keys.no_keys', defaultMessage: 'Please enter a private key' },
  keySetSuccess: { id: 'api_keys.key_set_success', defaultMessage: 'Private Key Successfully Saved' },
  keySetFail: { id: 'api_keys.key_set_fail', defaultMessage: 'Failed to save private key' },
  loading: { id: 'api_keys.loading', defaultMessage: 'Loading...' },
});

const ApiKeys = ({ apiKeys, fetchApiKeys, createApiKey, updateApiKey, deleteApiKey }) => {
  const [serviceName, setServiceName] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [keySetStatus, setKeySetStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    let timer;
    if (keySetStatus === false) {
      timer = setTimeout(() => {
        setKeySetStatus(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [keySetStatus]);

  const handleChangeServiceName = (e) => setServiceName(e.target.value);
  const handleChangePrivateKey = (e) => setPrivateKey(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setKeySetStatus(null);
    setIsLoading(true);

    const action = editingKey
      ? updateApiKey(editingKey.id, { serviceName, privateKey })
      : createApiKey({ serviceName, privateKey });

    action.then(response => {
      console.log("Response in handleSubmit:", response);
      if (response && response.api_key) {
        if (response.key_set === true) {
          setKeySetStatus(true);
        } else if (response.key_set === false) {
          setKeySetStatus(false);
        } else {
          setKeySetStatus(false);
        }
      } else {
        console.log("Unexpected response structure");
        setKeySetStatus(false);
      }
      setEditingKey(null);
      setServiceName('');
      setPrivateKey('');
      setIsLoading(false);
    }).catch(error => {
      console.error('Error in handleSubmit:', error);
      setKeySetStatus(false);
      setIsLoading(false);
    });
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setServiceName(key.serviceName);
    setPrivateKey(key.privateKey || '');
    setKeySetStatus(null);
  };

  const handleDelete = (id) => {
    deleteApiKey(id);
    setKeySetStatus(null);
  };

  const renderSubmitButton = () => {
    if (editingKey) {
      return <FormattedMessage {...messages.update} />;
    }
    return <FormattedMessage {...messages.submit} />;
  };

  const renderStatus = () => {
    if (isLoading) {
      return <p><FormattedMessage {...messages.loading} /></p>;
    } else if (keySetStatus === true) {
      return <p style={{ color: 'lime' }}><FormattedMessage {...messages.keySetSuccess} /></p>;
    } else if (keySetStatus === false) {
      return <p style={{ color: 'red' }}><FormattedMessage {...messages.keySetFail} /></p>;
    } else {
      return <p><FormattedMessage {...messages.noKeys} /></p>;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="api-key-form">
        <div className="input-group">
          <label className="form-label">
            <FormattedMessage {...messages.labelServiceName} />&nbsp;
          </label>
          <TextInput
            value={serviceName}
            placeholder={intl.formatMessage(messages.placeholderServiceName)}
            onChange={handleChangeServiceName}
          />
        </div>
        <div className="input-group">
          <label className="form-label">
            <FormattedMessage {...messages.labelPrivateKey} />&nbsp;
          </label>
          <TextInput
            value={privateKey}
            placeholder={intl.formatMessage(messages.placeholderPrivateKey)}
            onChange={handleChangePrivateKey}
          />
        </div>
        <div className="button-container">
          <Button 
            disabled={!serviceName || !privateKey || isLoading} 
            type='submit'
            className="small-button"
          >
            {renderSubmitButton()}
          </Button>
          {editingKey && (
            <Button 
              onClick={() => { setEditingKey(null); setServiceName(''); setPrivateKey(''); setKeySetStatus(null); }}
              className="small-button"
            >
              <FormattedMessage {...messages.cancel} />
            </Button>
          )}
        </div>
      </form>

      {Array.isArray(apiKeys) && apiKeys.length > 0 ? (
        <ul>
          {apiKeys.map(key => (
            <li key={key.id}>
              {key.serviceName}
              <Button onClick={() => handleEdit(key)}>
                <FormattedMessage {...messages.edit} />
              </Button>
              <Button onClick={() => handleDelete(key.id)}>
                <FormattedMessage {...messages.delete} />
              </Button>
            </li>
          ))}
        </ul>
      ) : renderStatus()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  apiKeys: state.getIn(['server', 'apiKeys', 'items']),
});

const mapDispatchToProps = {
  fetchApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeys);