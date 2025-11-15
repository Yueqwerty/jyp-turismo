using Microsoft.EntityFrameworkCore.Storage;
using JypTurismo.Core.Entities;
using JypTurismo.Core.Interfaces;
using JypTurismo.Infrastructure.Data;

namespace JypTurismo.Infrastructure.Repositories;

/// <summary>
/// Unit of Work implementation for managing database transactions.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;
    private bool _disposed;

    private IRepository<Message>? _messages;
    private IRepository<Conversation>? _conversations;
    private IRepository<Contact>? _contacts;
    private IRepository<Attachment>? _attachments;

    /// <summary>
    /// Initializes a new instance of the <see cref="UnitOfWork"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    /// <inheritdoc/>
    public IRepository<Message> Messages
    {
        get
        {
            _messages ??= new Repository<Message>(_context);
            return _messages;
        }
    }

    /// <inheritdoc/>
    public IRepository<Conversation> Conversations
    {
        get
        {
            _conversations ??= new Repository<Conversation>(_context);
            return _conversations;
        }
    }

    /// <inheritdoc/>
    public IRepository<Contact> Contacts
    {
        get
        {
            _contacts ??= new Repository<Contact>(_context);
            return _contacts;
        }
    }

    /// <inheritdoc/>
    public IRepository<Attachment> Attachments
    {
        get
        {
            _attachments ??= new Repository<Attachment>(_context);
            return _attachments;
        }
    }

    /// <inheritdoc/>
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction == null)
        {
            throw new InvalidOperationException("No transaction has been started.");
        }

        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            await _transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    /// <inheritdoc/>
    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    /// <summary>
    /// Disposes the Unit of Work and releases resources.
    /// </summary>
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Disposes the Unit of Work and releases resources.
    /// </summary>
    /// <param name="disposing">Whether to dispose managed resources.</param>
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
        _disposed = true;
    }
}
