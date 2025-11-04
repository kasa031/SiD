import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { validatePollTitle, validateComment } from '../utils/validation';
import '../styles/CreatePollPage.css';

function CreatePollPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState('land');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [politicianTags, setPoliticianTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const categories = [
    { value: 'miljo', label: 'Miljø' },
    { value: 'samfunn', label: 'Samfunn' },
    { value: 'helse', label: 'Helse' },
    { value: 'utdanning', label: 'Utdanning' },
    { value: 'transport', label: 'Transport' },
    { value: 'okonomi', label: 'Økonomi' },
    { value: 'politikk', label: 'Politikk' },
    { value: 'kultur', label: 'Kultur' }
  ];

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !politicianTags.includes(newTag.trim())) {
      setPoliticianTags([...politicianTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setPoliticianTags(politicianTags.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    const titleError = validatePollTitle(title);
    if (titleError) {
      setValidationErrors({ title: titleError });
      setError(titleError);
      return;
    }

    const validOptions = options.filter(opt => opt.trim().length > 0);
    if (validOptions.length < 2) {
      setError('Du må ha minst 2 alternativer');
      return;
    }

    if (locationType === 'by' && !locationName.trim()) {
      setError('Du må oppgi bynavn når du velger "by"');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/polls', {
        title: title.trim(),
        description: description.trim() || null,
        location_type: locationType,
        location_name: locationType === 'by' ? locationName.trim() : null,
        category: category || null,
        options: validOptions,
        politician_tags: politicianTags,
      });

      navigate(`/poll/${response.data.poll_id}`);
      window.showToast?.('Poll opprettet!', 'success');
      
      // Check for badges
      try {
        await api.post('/badges/check');
      } catch (e) {
        // Ignore badge check errors
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Feil ved opprettelse av poll';
      setError(errorMsg);
      window.showToast?.(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-poll-page">
      <div className="create-poll-card">
        <h1>Opprett ny poll</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tittel *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationErrors.title) {
                  setValidationErrors({ ...validationErrors, title: null });
                }
              }}
              required
              placeholder="Hva skal pollen handle om?"
            />
            {validationErrors.title && (
              <span className="validation-error">{validationErrors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Beskrivelse</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Gi mer informasjon om pollen (valgfritt)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="locationType">Område *</label>
            <select
              id="locationType"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option value="land">Hele landet</option>
              <option value="by">Spesifikk by</option>
            </select>
          </div>

          {locationType === 'by' && (
            <div className="form-group">
              <label htmlFor="locationName">Bynavn *</label>
              <input
                type="text"
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required={locationType === 'by'}
                placeholder="f.eks. Oslo, Bergen, Trondheim"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="category">Kategori (valgfritt)</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Ingen kategori</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Alternativer * (minst 2)</label>
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Alternativ ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="remove-button"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="button-blue"
            >
              + Legg til alternativ
            </button>
          </div>

          <div className="form-group">
            <label>Politikere (valgfritt)</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Skriv politiker-navn og trykk Enter"
              />
              <button type="button" onClick={handleAddTag} className="button-green">
                Legg til
              </button>
            </div>
            {politicianTags.length > 0 && (
              <div className="tags-list">
                {politicianTags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    @{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="button-green full-width"
            disabled={loading}
          >
            {loading ? 'Oppretter...' : 'Opprett poll'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePollPage;

