import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { validatePollTitle, validateComment } from '../utils/validation';
import { CATEGORIES } from '../utils/categories';
import { trackPollCreation } from '../utils/analytics';
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
  const [validationErrors, setValidationErrors] = useState({});
  
  const categories = CATEGORIES;

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

      const pollId = response.data.poll_id;
      navigate(`/poll/${pollId}`);
      window.showToast?.('Poll opprettet!', 'success');
      
      // Track poll creation in analytics
      trackPollCreation(pollId, category);
      
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
    <div className="create-poll-page" role="main">
      <div className="create-poll-card">
        <h1>Opprett ny poll</h1>
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} aria-label="Opprett ny poll skjema">
          <div className="form-group">
            <label htmlFor="title">Tittel *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationErrors.title) {
                  setValidationErrors({ ...validationErrors, title: null });
                }
              }}
              required
              placeholder="Hva skal pollen handle om?"
              aria-required="true"
              aria-invalid={validationErrors.title ? 'true' : 'false'}
              aria-describedby={validationErrors.title ? 'title-error' : undefined}
            />
            {validationErrors.title && (
              <span 
                id="title-error" 
                className="validation-error" 
                role="alert"
                aria-live="polite"
              >
                {validationErrors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Beskrivelse</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Gi mer informasjon om pollen (valgfritt)"
              aria-label="Beskrivelse av poll"
            />
          </div>

          <div className="form-group">
            <label htmlFor="locationType">Område *</label>
            <select
              id="locationType"
              name="locationType"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              aria-required="true"
              aria-label="Velg område for poll"
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
                name="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required={locationType === 'by'}
                placeholder="f.eks. Oslo, Bergen, Trondheim"
                aria-required="true"
                aria-label="Bynavn"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="category">Kategori (valgfritt)</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Velg kategori for poll"
            >
              <option value="">Ingen kategori</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="option-0">Alternativer * (minst 2)</label>
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  type="text"
                  id={`option-${index}`}
                  name={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Alternativ ${index + 1}`}
                  required
                  aria-required="true"
                  aria-label={`Alternativ ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="remove-button"
                    aria-label={`Fjern alternativ ${index + 1}`}
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
              aria-label="Legg til nytt alternativ"
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

